import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCommonComponent } from "../user-common/user-common.component";
import { Broadcaster } from '../services/app.broadCaster';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-my-home',
  templateUrl: './my-home.component.html',
  styleUrls: ['./my-home.component.css']
})
export class MyHomeComponent implements OnInit {
  // For Lazy Loadder
  public defaultImage : any;
  public offset : any;
  //imagess = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';
  public user_id: number;
  public user: any = {};
  public page: number;
  //public preset: number;
  public feed_list: any = [];
  public common_message: string;
  public loadMore: boolean;

  @ViewChild(UserCommonComponent) child;

  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, public broadcaster: Broadcaster) {
    this.page = 1;
    this.loadMore = false;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.defaultImage = 'assets/img/loader1.gif';
    this.offset = 100;
    //this.preset = 1;

    this.broadcaster.on<string>('bidPlaced')
      .subscribe(message => {
        this.feed_list = [];
        this.page = 1;
        this.getFeeds();
      });
    this.broadcaster.on<string>('forFeedRefreshing')
      .subscribe(message => {
        this.feed_list = [];
        this.page = 1;
        this.getFeeds();
      });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    $("body").removeClass("landing-page");
    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      $(".nano").nanoScroller();
      $(".nano").nanoScroller().bind("scrollend", (e) => {
        this.onScrollDown();
      })

    }, 100);
    this.getFeeds();
  }
  publicProfile(creator_id) {
    if (creator_id != this.user_id) {
      this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
    } else {
      return true;
    }
  }
  getFeeds() {
    let data = { user_id: this.user_id, page: this.page };
    this.apiService._post('home_feeds', data)
      .subscribe(result => {
        console.log('Home Feeds', result);
        if (result.status === true) {
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              if(result.data[i].feed_type == 4){
                let venue = result.data[i].feed_data.venue.split("-");
                result.data[i].feed_data.venue = venue[0];
              }
              this.feed_list.push(result.data[i]);
            }
          } else {
            this.loadMore = true;
            $('.nano').unbind("scrollend");
          }
          // this.error_message = "";
        } else {
          this.common_message = 'No Feeds';
        }

      });
  }
  onScrollDown = function () {
    // console.log('hereeee',this.page);
    this.page = this.page + 1;
    this.getFeeds();
  };

  eventDetails(event_id) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: event_id } });
  }

  tgsDetails(tgs_id) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: tgs_id } });
  }


  // bidDetails(bid_id) {
  //   this.router.navigate(['/auction-details'], { queryParams: { bid_id: bid_id } });
  // }
  openModalForBuyTickets(curEvent) {
    this.child.currentEvent = curEvent;
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }



  /**
   * for bids
   * 
   */

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

  openModalForBuyBid(curBid) {
    // console.log('curBid',curBid);
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
      this.buyNow(curBid);
  }

  buyNow(curEvent) {
    this.child.currentEvent = curEvent;
    //console.log(curEvent,'123456789eeeeeeeeeeeeeeeeeeee');
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }


}
