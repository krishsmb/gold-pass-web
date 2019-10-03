import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var $: any;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userForm: any;
  public error_message: string;
  public notification_message: string;
  public success_message: string;
  public user_id: number;
  public user: any = {};
  public industries: any = [];
  public tempArry: any = [];
  public profile_image: any;
  public optionSelected: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  // data1:any;
  // cropperSettings1:CropperSettings;
  // @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'user_name': ['', Validators.required],
      // 'industry_id': ['', Validators.required], 
      'email': ['', Validators.required],
      'about': ['', Validators.required]
      //'profile': ['', [Validators.required, Validators.minLength(10)]]
    });


    // this.cropperSettings1 = new CropperSettings();
    // this.cropperSettings1.width = 200;
    // this.cropperSettings1.height = 200;

    // this.cropperSettings1.croppedWidth = 200;
    // this.cropperSettings1.croppedHeight = 200;

    // this.cropperSettings1.canvasWidth = 500;
    // this.cropperSettings1.canvasHeight = 300;

    // this.cropperSettings1.minWidth = 100;
    // this.cropperSettings1.minHeight = 100;

    // this.cropperSettings1.rounded = false;

    // this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    // this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;

    // this.data1 = {};
  }

  ngOnInit() {
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.userDetails();
    this.industry_list();
    // $("#new_pic").hide();

  }

  userDetails() {

    let data = { user_id: this.user_id };
    this.apiService._post('user_details', data)
      .subscribe(result => {
        //console.log(result);
        if (result['status'] === true) {
          this.user = result['data'];


        } else {

        }
      });
  }





  // test(){
  //   console.log('hai');
  // }

  // setIndustry(){

  // }

  industry_list() {

    let data = { user_id: this.user_id };
    this.apiService._post('industry_list', data)
      .subscribe(result => {
        //console.log(result);
        if (result['status'] === true) {
          this.industries = result['data'];
          console.log(this.industries);


          setTimeout(function () {
            $('select').material_select();
          }, 20);

          // console.log(typeof this.industries);
          // for(var i=0;i<this.industries.length;i++){

          //   tempArry.push(this.industries[i].title);
          //   console.log(tempArry,'dddd');
          // }


        } else {

        }
      });
  }

  openImageUploader() {
    let div = $("#modalPicture");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }
  closePictureModal() {
    $("#uploadfile").val(null);
    let div = $("#modalPicture");
    if (!div.length) return;


    //div.modal({});

    div.modal("close");
  }

  savePictureModal() {
    this.user.profile_image = this.croppedImage;
    this.profile_image = this.croppedImage;
    $("#uploadfile").val(null);
    let div = $("#modalPicture");
    if (!div.length) return;
    //div.modal({});
    $("#uploadfile").val(null);
    div.modal("close");
    //location.reload();


  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.openImageUploader();
  }
  imageCropped(image: string) {
    this.croppedImage = image;
    //console.log(this.croppedImage);
    // $("#new_pic").show();
    //$("#old_pic").hide();
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  setSelectedIndustry(industry_id) {
    console.log(industry_id, 'Industry ID');

  }
  editProfile() {
    // console.log(this.user,'userrrrrrrrrrrrrrr');

    // if (this.userForm.dirty && this.userForm.valid) {
    let data = {
      first_name: this.userForm.value.first_name,
      last_name: this.userForm.value.last_name,
      user_name: this.userForm.value.user_name,
      email: this.userForm.value.email,
      about: this.userForm.value.about,
      industry_id: this.user.industry_id,
      image64: this.croppedImage,
      user_id: this.user_id
    };
    console.log(data);
    this.apiService._post('edit_profile', data)
      .subscribe(result => {
        console.log(result);
        // this.loading = false;
        if (result['status'] === true) {
          this.notification_message = result['message'];
          this.doneSetting();
          this.editModalNotification();
        } else {
          //this.error_message = result['message'];
          //this.loading = false;
          // this.user.password = "" ;
        }
      });
    // }
  }
  editModalNotification() {
    // console.log(this.notification_message);
    // this.notification_message=localStorage.getItem("notification_message");
    let div = $("#editNotification");
    if (!div.length) return;
    div.modal({});
    div.modal("open");

  }
  closeEditNotification() {
    let div = $("#editNotification");
    if (!div.length) return;
    // div.modal({});
    div.modal("close");
    this.router.navigate(['/my-home']);
  }
  showUploder() {
    $("#uploadfile").click();
  }
  doneSetting(): void {
    // send message to subscribers via observable subject
    this.apiService.updateSetting(true);

  }

  /**
   * 
   * for updation of industries
   */
  industryUpdate(eve) {
    this.user.industry_id = $(eve.target).val() || null;
  }
}
