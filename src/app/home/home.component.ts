import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  public loading = false;
  public user_id: any;
  public popular_meetings: any = [];
  public popular_bids: any = [];
  public popular_testimonials: any = [];
  public popular_tgs: any = [];
  public error_message: string;
  public success_message: string;
  public page: number;
  public login: boolean;
  public user_details: any = {};
  form: FormGroup;
  public videoControlerPlayStatus = false;
  // public videoUrl: any = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
  public videoUrl: any;
  // tslint:disable-next-line:max-line-length
  @ViewChild('videoControler') videoControler: any;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private elementRef: ElementRef) {
    this.home_video();
    this.error_message = null;
    if (this.apiService.isLoggedIn()) {
      console.log('In', this.apiService.isLoggedIn());
      this.user_id = this.apiService.isLoggedIn();
      let data = { user_id: this.user_id };
      this.apiService._post('user_details', data)
        .subscribe(result => {
          if (result['status'] === true) {
            this.user_details = result.data;
            this.login = true;
          } else {
            if (result['statusCode'] == 'TokenMissing') {
              this.login = false;
            }
          }
        });
    }else {
      // this.router.navigate(['/home']);
      this.login = false;
    }
  }

  ngOnInit() {
    this.randomtestimonials();
    this.popularmeetings();
    this.popularbids();
    this.popularTgs();
    this.form = this.formBuilder.group({
      user_name: [null, Validators.required],
      password: [null, Validators.required],
    });

  }

  ngAfterViewInit() {
    // console.log('ngAfterViewInit: ', this.videoControler.nativeElement);
    this.videoControler.nativeElement.addEventListener('ended', afterEnd => {
      this.togglePlayPauseButton();
    });
  }

  home_video() {
    const data = {};
    this.apiService._post('home_video', data).subscribe(result => {
      if (result.status === true) {
        this.videoUrl = result.data.value;
      }else {
        this.videoUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
      }
      this.videoControler.nativeElement.autoplay = true;
      this.videoControler.nativeElement.load();
      this.videoControler.nativeElement.pause();
      this.videoControler.nativeElement.play();
    });
  }

  popularmeetings() {
    let data = { page: 1 };
    this.apiService._post('popular_meetings', data)
      .subscribe(result => {
        // console.log(result);
        this.loading = false;
        if (result['status'] === true) {
          this.popular_meetings = result['data'];
          // this.loading = false;

          // this.router.navigate(['/home']);
        } else {
          this.error_message = result['message'];
          this.loading = false;
          // this.user.password = "" ;
        }
      });

  }

  popularTgs() {
    const data = { page: 1 };
    this.apiService._post('popular_tgs', data)
      .subscribe(result => {
        this.loading = false;
        if (result['status'] === true) {
          this.popular_tgs = result['data'];
          console.log('popular_tgs: ', this.popular_tgs);
        } else {
          this.error_message = result['message'];
          this.loading = false;
        }
      });

  }


  popularbids() {
    let data = { page: 1 };
    this.apiService._post('popular_bids', data)
      .subscribe(result => {
        // console.log(result);
        this.loading = false;
        if (result['status'] === true) {
          this.popular_bids = result['data'];
          // this.loading = false;

          // this.router.navigate(['/home']);
        } else {
          this.error_message = result['message'];
          this.loading = false;
          // this.user.password = "" ;
        }
      });
  }
  randomtestimonials() {
    let data = { page: 1 };
    this.apiService._post('popular_testimonials', data)
      .subscribe(result => {
        // console.log(result);
        this.loading = false;
        if (result['status'] === true) {
          this.popular_testimonials = result['data'];
          console.log(this.popular_testimonials);
          setTimeout(() => {
            $('.automatic-slider').unslider({
              keys: true,
              arrows: false,
              nav: true
            });
          }, 2000);


        } else {
          this.error_message = result['message'];
          this.loading = false;
          // this.user.password = "" ;
        }
      });
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }
  onSubmit() {

    if (this.form.valid) {
      this.spinnerService.show();
      this.apiService._post('login', this.form.value)
        .subscribe(result => {
          if (result['status'] === true) {
            localStorage.setItem('loggedIn', JSON.stringify(result['data']));
            localStorage.setItem('notification_count', JSON.stringify(result['notification_count']));
            localStorage.setItem('user_type', JSON.stringify(result['data'].user_type));
            localStorage.setItem('user_id', JSON.stringify(result['data'].user_id));
            // localStorage.setItem("admin_verified_message_status", result['data'].admin_verified);
            this.spinnerService.hide();

            setTimeout(() => {
              this.router.navigate(['/my-home']);
            }, 200);


          } else {
            this.error_message = result['message'];
            console.log(this.error_message);
            this.spinnerService.hide();
          }
        });
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  reset() {
    this.form.reset();
  }

  openUserNav() {
    document.getElementById('userNav').style.display = 'block';
  }
  openForgotNav() {
    document.getElementById('forgotNav').style.display = 'block';
  }

  videoPlayPause() {
    if (this.videoControler.nativeElement.paused || this.videoControler.nativeElement.ended) {
      this.videoControler.nativeElement.play();
    }else {
      this.videoControler.nativeElement.pause();
    }
    this.togglePlayPauseButton();
  }

  togglePlayPauseButton() {
    if (this.videoControler.nativeElement.paused || this.videoControler.nativeElement.ended) {
      this.videoControlerPlayStatus = true;
    }else {
      this.videoControlerPlayStatus = false;
    }
  }




























  // onScroll () {
  //   this.loading = true;
  //   this.page=this.page+1;
  //   console.log('scrolled!!',this.page)
  //   //console.log('scrolled!!')
  //   // home feeds
  //   let data={user_id:this.user_id,page:this.page};
  //   this.apiService._post('home_feeds', data)
  //   .subscribe(result => {
  //     console.log(result);
  //       this.loading = false;
  //       if (result['status'] === true) {
  //         let feeds_new=result['data'];  
  //         this.feeds.push(feeds_new)
  //          // this.loading = false;
  //          this.loading = false;

  //           this.router.navigate(['/home']);
  //       } else {
  //           this.error_message = result['message'];
  //           this.loading = false;
  //           //this.loading = false;
  //           // this.user.password = "" ;
  //       }
  //   });
  // }

}
