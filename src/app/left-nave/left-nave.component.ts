import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { UserCommonComponent } from '../user-common/user-common.component';
import { Broadcaster } from '../services/app.broadCaster';

declare var $: any;
@Component({
  selector: 'app-left-nave',
  templateUrl: './left-nave.component.html',
  styleUrls: ['./left-nave.component.css']
})
export class LeftNaveComponent implements OnInit {
  public user_id: number;
  public user: any = {};
  subscription: Subscription;
  public profile_info: any = {};
  previousUrl: string;
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, public router: Router, public broadcaster: Broadcaster) {
    console.log(router.url, 'Current Url');
    if (router.url == '/my-profile' || router.url == '/my-following' || router.url == '/my-followersList') {
      this.profileDetails();
    }
    router.events.filter(event => event instanceof NavigationEnd)
      .subscribe((e: any) => {
        // console.log('prev:', this.previousUrl); 
        // this.previousUrl = e.url;
        //console.log('prev 1:', this.previousUrl); 
      });
    this.subscription = this.apiService.doneSetting().subscribe(message => { if (message) this.userDetails(); });
  }

  ngOnInit() {
    this.userDetails();
    
    
    //   setTimeout(()=>{    //<<<---    using ()=> syntax
    //       $(".is-stickable").stickySidebar({
    //         topSpacing: 60,
    //         bottomSpacing: 60,
    //         });
    //  },1000);
  }

  profileDetails() {
    //this.celebrity_id=440;
    this.user_id = parseInt(localStorage.getItem("user_id"));
    let data = { user_id: this.user_id };
    this.apiService._post('my_profile', data)
      .subscribe(result => {
        console.log(result,'Profile Details');
        if (result['status'] === true) {
          this.profile_info = result['data'];
          // this.auctions_win_list=result['auctions_win_list']; 
          // this.events_attented_list=result['events_attented_list'];
          // this.testimonials=result['testimonials'];     
        } else {

        }
      });
  }
  userDetails() {
    this.user_id = parseInt(localStorage.getItem("user_id"));
    let data = { user_id: this.user_id };
    this.apiService._post('user_details', data)
      .subscribe(result => {
        console.log(result,'User Details');
        if (result['status'] === true) {
          this.user = result['data'];
        } else {
        }
      });
  }
  openModalEvent() {
    if (this.user.celebrity_payment_profile == 'Yes') {
      this.broadcaster.broadcast("formClear", "clear");
      let div = $("#modal2");
      if (!div.length) return;

      div.modal({
        backdrop: 'static',
        keyboard: false
      });
      // console.log(this.child.meetingForm, 'test meeting form');
      // this.child.meetingForm.reset();
      div.modal("open");
    } else {
      let div = $("#celebrity_payment");
      if (!div.length) return;
      div.modal({});
      div.modal("open");
    }
  }
  openModalAuction() {
    if (this.user.celebrity_payment_profile == 'Yes') {
      this.broadcaster.broadcast("formClear", "clear");
      let div = $("#modal1");
      if (!div.length) return;
      div.modal({
        backdrop: 'static',
        keyboard: false
      });
      div.modal("open");
    } else {
      let div = $("#celebrity_payment1");
      if (!div.length) return;
      div.modal({});
      div.modal("open");
    }
  }

  openModalTgs(){
    if (this.user.celebrity_payment_profile == 'Yes') {
      this.broadcaster.broadcast("formClear", "clear");
      let div = $("#modal3");
      if (!div.length) return;

      div.modal({
        backdrop: 'static',
        keyboard: false
      });
      
      div.modal("open");
    } else {
      let div = $("#celebrity_payment");
      if (!div.length) return;
      div.modal({});
      div.modal("open");
    }
  }

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  getFollowingList() {
    if (this.router.url == '/my-profile' || this.router.url == '/my-followersList' || this.router.url == '/my-following') {
      this.router.navigate(['/my-following']);
    } else {
      this.router.navigate(['/following']);
    }
  }
  getFollowersList() {
    if (this.router.url == '/my-profile' || this.router.url == '/my-following' || this.router.url == '/my-followersList') {
      this.router.navigate(['/my-followersList']);
    } else {
      this.router.navigate(['/my_followers'])
    }
  }
}
