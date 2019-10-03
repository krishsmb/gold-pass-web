import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserCommonComponent } from "../user-common/user-common.component";
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Broadcaster } from '../services/app.broadCaster';
// import { ICarouselConfig, AnimationConfig } from 'angular4-carousel';

declare var $: any;
@Component({
  selector: 'app-bid-details',
  templateUrl: './bid-details.component.html',
  styleUrls: ['./bid-details.component.css']
})
export class BidDetailsComponent implements OnInit {
  public user_id: number;
  public user: any = {};
  public bid_data: any = {};
  public common_message: string;
  public bid_id: number;
  private sub: any;
  public imageSources: string[] = [];
  // public config: ICarouselConfig = {
  //   verifyBeforeLoad: true,
  //   log: false,
  //   animation: true,
  //   animationType: AnimationConfig.SLIDE,
  //   autoplay: true,
  //   autoplayDelay: 2000,
  //   stopAutoplayMinWidth: 768
  // };
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute, public broadcaster: Broadcaster) {
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.user = JSON.parse(localStorage.getItem("loggedIn"));

    this.broadcaster.on<string>('bidPlaced')
      .subscribe(message => {
        this.bid_data = {};
        // console.log('hereeeeeeeeeeeee');
        this.eventDetails();
      });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.bid_id = +params['bid_id'] || 0;
        console.log(this.bid_id);
        this.eventDetails();
      });
  }
  eventDetails() {
    let data = { user_id: this.user_id, bid_id: this.bid_id };
    this.apiService._post('auction_details', data)
      .subscribe(result => {

        if (result['status'] === true) {
          this.bid_data = result['data'];
          // console.log(this.event_data);
          // this.error_message = "";
        } else {
          this.common_message = "No Feeds";
        }

      });
  }
  someFun(){
    console.log("Alert function","Hi");
  }
  

  /**
   * for bids
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
