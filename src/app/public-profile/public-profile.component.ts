import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserCommonComponent } from "../user-common/user-common.component";
import { Broadcaster } from '../services/app.broadCaster';
declare var $: any;
// getCardSuccess

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  public celebrity_id: any;
  public user_id: any;
  public celebrity_info: any = {};
  public sub: any;
  public meetingType: any;
  public page: number;
  public loadMore: boolean;
  public meetingSec: boolean;
  public bidSec: boolean;
  public eventList: any = [];
  public tgsList: any = [];
  public data_list: any = [];
  public view: string;
  public follow_type: string;
  public created_by: number;
  public user: any = [];
  public cardList: any = [];
  public defaultImage: any;
  @ViewChild(UserCommonComponent) child;

  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, public broadcaster: Broadcaster) {
    this.page = 1;
    this.loadMore = true;
    this.meetingSec = true;
    this.meetingType = "open";
    this.bidSec = false;
    this.user = JSON.parse(localStorage.getItem('loggedIn'));
    console.log('Current user : ', this.user);
    this.user_id = parseInt(localStorage.getItem('user_id'));
    this.view = "gp_lists";
    this.created_by = 0;
    this.broadcaster.on<string>('getCardSuccess')
      .subscribe(message => {
        console.log(message, 'ddddddd');
        this.cardList = message;
        // this.data.page = 1;
        // console.log('hereeeeeeeeeeeee');

      });

    //For LazyLoad
    this.defaultImage = 'assets/img/loader1.gif';

  }


  ngOnInit() {

    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.celebrity_id = +params['creator_id'] || 0;
        this.celebrityDetails();
        this.getMeetings(this.meetingType);
      });

    window.scrollTo(0, 0);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();

  }

  changeType(type, secType, created_myself) {

    this.eventList = [];
    this.tgsList = [];
    this.created_by = created_myself;
    this.view = "gp_lists";
    if (secType == 'meeting') {
      this.meetingSec = true;
      this.bidSec = false;
    } else {
      this.bidSec = true;
      this.meetingSec = false;
    }
    // this.eventList = [];
    // this.tgsList = [];
    this.page = 1;
    window.scrollTo(0, 0);
    if (this.meetingSec)
      this.getMeetings(type);
    else
      this.getBids(type);
  }

  celebrityDetails() {
    //this.celebrity_id=440;\

    let data = {};

    if (this.user_id != this.celebrity_id)
      data = { user_id: this.user_id, celebrity_id: this.celebrity_id };
    else
      data = { user_id: this.user_id, celebrity_id: this.user_id };
    this.apiService._post('celebrity_profile_details', data)
      .subscribe(result => {
        console.log(result);

        if (result['status'] === true) {
          console.log(this.user_id, this.celebrity_id);
          this.celebrity_info = result['data'];
          this.created_by = this.celebrity_info.user_type

        } else {

        }
      });
  }

  followMe(list, follow) {
    let data = {
      user_id: this.user_id,
      celebrity_id: list.user_id,
      follow: follow
    }
    this.apiService._post('start_follow', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;

          for (let i = 0; i < this.data_list.length; i++) {
            if (this.data_list[i].user_id == list.user_id)
              this.data_list[i].is_follow = follow;
          }
          let msg = '';
          if (follow)
            msg = "Started following " + list.first_name + " " + list.last_name;
          else
            msg = "Unfollowed " + list.first_name + " " + list.last_name;
          this.child.notification_message = msg;
          this.openModalNotification();


        } else {
          // this.error_message = result.message;

        }
      });
  }

  /** 
   * for applying pagination while scrolling
   */
  onScrollDown = function () {
    // console.log('hereeee',this.page);
    this.page = this.page + 1;
    if (this.meetingSec)
      this.getMeetings(this.meetingType);
    else
      this.getBids(this.meetingType);
  }

  getBids(meetngType) {
    //console.log(meetngType,'1234567899999999999999');
    this.meetingSec = false;
    this.bidSec = true;
    this.meetingType = meetngType;

    let data = {};
    if(this.celebrity_info.user_type == 1){
      data = {
        celebrity_id: this.celebrity_id,
        status: this.meetingType,
        page: this.page
      };
    }else{
      data = {
        // celebrity_id: this.celebrity_id,
        created_myself : 2,
        user_id : this.celebrity_id,
        status: this.meetingType,
        page: this.page
      };
    }
    

    this.apiService._post('all_tgs', data)
      .subscribe(result => {
        if (result.status === true) {
          // this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.tgsList.push(result.data[i]);
            }
          } else {
            this.loadMore = true;
          }

        } else {
          // this.error_message = result.message;

        }
      });
  }

  getMeetings(meetngType) {
    this.meetingSec = true;
    this.bidSec = false;
    this.meetingType = meetngType;
    // console.log(this.meetingType , '12345678900000');
    let data = {
      user_id: this.user_id,
      status: this.meetingType,
      celebrity_id: this.celebrity_id,
      page: this.page,
      created_myself: this.created_by
    };
    this.apiService._post('all_events', data)
      .subscribe(result => {
        if (result.status === true) {
          // this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.eventList.push(result.data[i]);
            }
          } else {
            if (this.page == 1)
              this.eventList = [];
          }
        } else {
          //  this.error_message = result.message;

        }
      });
  }



  followUnFollow(followStatus) {
    let data = {
      user_id: this.user_id,
      celebrity_id: this.celebrity_id,
      follow: false
    }
    if (followStatus)
      data.follow = false;
    else
      data.follow = true;
    this.apiService._post('start_follow', data)
      .subscribe(result => {
        if (result.status === true) {
          this.celebrity_info.following = data.follow;
          let msg = '';
          if (followStatus)
            msg = "Unfollowed " + this.celebrity_info.first_name + " " + this.celebrity_info.last_name;
          else
            msg = "Started Following " + this.celebrity_info.first_name + " " + this.celebrity_info.last_name;
          this.child.notification_message = msg;
          this.openModalNotification();
        } else {
          // this.error_message = result.message;

        }
      });
  }


  followingLists(celebrity_id) {
    this.view = "follow";
    this.follow_type = "Following";
    let data = {};
    if (this.user_id == this.celebrity_id) {
      data = { user_id: this.user_id, celebrity_id: '' };
    } else {
      data = { user_id: this.user_id, celebrity_id: this.celebrity_id };
    }

    this.apiService._post('following_list', data)
      .subscribe(result => {
        console.log(result);
        if (result['status'] === true) {
          this.data_list = result['data'];

        } else {

        }
      });
  }
  followersLists(celebrity_id) {
    this.view = "follow";
    this.follow_type = "Followers";
    let data = {};
    if (this.user_id == this.celebrity_id) {
      data = { user_id: this.user_id, celebrity_id: '' };
    } else {
      data = { user_id: this.user_id, celebrity_id: this.celebrity_id };
    }
    this.apiService._post('followers_list', data)
      .subscribe(result => {
        console.log(result);
        if (result['status'] === true) {
          this.data_list = result['data'];

        } else {

        }
      });
  }

  publicProfile(creator_id) {
    if (creator_id != this.user_id) {
      this.view = "gp_lists";
      this.meetingType = "open";
      this.meetingSec = true;
      this.bidSec = false;
      // this.getMeetings( this.meetingType);
      this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });


    } else {
      return true;
    }
  }

  tgsDetails(tgs_id) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: tgs_id } });
  }

  // publicProfile(creator_id){
  //   this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  // }

  openModalNotification() {
    let div = $("#modalNotification");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  bidDetails(bid_id) {
    this.router.navigate(['/auction-details'], { queryParams: { bid_id: bid_id } });
  }
  eventDetails(event_id) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: event_id } });
  }

  openModalForBuyTickets(curEvent) {
    this.child.currentEvent = curEvent;
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  openModalForBuyBid(curBid) {
    console.log('curBid', curBid);
    var bidList = this.doCalc(curBid);
    this.child.bid = curBid;
    this.child.bidList = bidList;
    this.child.curBidAmount = bidList[0];
    if (this.user.consumer_stripe_account) {
      let div = $("#bidModal");
      if (!div.length) return;
      div.modal({});
      div.modal("open");
    } else
      this.openModalForBuyTickets(curBid);
  }

  doCalc(bidDetail) {
    //console.log('####bidDetail', bidDetail);
    let bidDEtails = bidDetail;
    let myObject = Object.assign({}, bidDetail);
    //console.log('myObject88888888888',myObject);
    var myTempArry = [];

    if (myObject.latest_bidder_id) { //already bidded
      let bid_amount = myObject.latest_bid_amount;
      // for(var i=bid_amount;i<myObject.max_bid_amount;i++){
      while ((bid_amount + myObject.bid_difference_amount) < myObject.max_bid_amount) {
        var amount = myObject.latest_bid_amount + myObject.bid_difference_amount;
        myTempArry.push(amount);
        bid_amount = amount;
        myObject.latest_bid_amount = amount;
      }

      // }
    } else { // first bidding
      let bid_amount = myObject.minimum_bid_amount;
      // for(var i=bid_amount;i<myObject.max_bid_amount;i++){
      while ((bid_amount + myObject.bid_difference_amount) < myObject.max_bid_amount) {
        var amount = myObject.minimum_bid_amount + myObject.bid_difference_amount;
        myTempArry.push(amount);
        bid_amount = amount;
        myObject.minimum_bid_amount = amount;
      }

      // }
    }
    //console.log('myTempArryyyy.........',myTempArry);
    return myTempArry;

  }


}
