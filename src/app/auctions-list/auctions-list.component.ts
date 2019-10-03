import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';
import { UserCommonComponent } from "../user-common/user-common.component";
import { Broadcaster } from '../services/app.broadCaster';

declare var $: any;

@Component({
  selector: 'app-auctions-list',
  templateUrl: './auctions-list.component.html',
  styleUrls: ['./auctions-list.component.css']
})
export class AuctionsListComponent implements OnInit {
  public error_message: string;
  public success_message: string;
  public user_id: number;
  public auctionsList: any = [];
  public bidType: string;
  public bidTitle: string;
  public loadMore: boolean;
  public user: any = {};
  public page: number;
  public currentEvent: any;
  public noCard: boolean;
  public cardList: any = [];
  public data: any = {};
  public bid: any = {};
  public url: string;
  subscription: Subscription;
  public defaultImage : any;
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router, public broadcaster: Broadcaster) {
    this.page = 1;
    this.bidType = '';
    this.loadMore = false;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
    this.noCard = false;
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.url = this.router.url;
    switch (this.router.url) {
      case '/all_auctions':
        this.data = {
          user_id: this.user_id,
          created_myself: 0,
          status: this.bidType,
          page: this.page,

        }
        this.bidTitle = 'National Gold Retail';
        break;
      case '/my_auctions':
        this.data = {
          user_id: this.user_id,
          created_myself: 2,
          status: this.bidType,
          page: this.page
        }
        this.bidTitle = 'My Bids';
        break;
      case '/auctions_hosted':
        this.data = {
          user_id: this.user_id,
          created_myself: 1,
          status: this.bidType,
          page: this.page
        }
        this.bidTitle = 'Gold Retail';
        break;
      case '/user_retail':
        this.data = {
          user_id: this.user_id,
          created_myself: 3,
          status: this.bidType,
          page: this.page
        }
        this.bidTitle = 'My Gold Retail';
        break;
    }

    //For LazyLoad
    this.defaultImage = 'assets/img/loader1.gif';

    // this.subscription = this.apiService.placeBid().subscribe(message => { 
    //   this.auctionsList = [];
    //   // console.log('sfffffffffff');
    //   if(message) this.LoadAuctionsList(this.bidType); 
    // });
    this.broadcaster.on<string>('bidPlaced')
      .subscribe(message => {
        this.auctionsList = [];
        this.data.page = 1;
        // console.log('hereeeeeeeeeeeee');
        this.LoadAuctionsList(this.bidType, true);
      });
    this.broadcaster.on<string>('forFeedRefreshing')
      .subscribe(message => {
        this.auctionsList = [];
        this.data.page = 1;
        // console.log('hereeeeeeeeeeeee');
        this.LoadAuctionsList(this.bidType, true);
      });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.LoadAuctionsList(this.bidType, false);
    setTimeout(function () {
      $('.dropdown-button').dropdown();
    }, 200);

    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      $(".nano").nanoScroller();
      $(".nano").nanoScroller().bind("scrollend", (e) => {
        this.onScrollDown();
      })

    }, 100);
  }

  changebidType = function (bidType) {

    // console.log(bidType,'bidtypeeeeeeeeeee');
    this.loadMore = false;
    this.bidType = bidType;
    // console.log(this.bidType,'bidtypeeeeeeeeeee');
    this.page = 1;
    this.auctionsList = [];
    switch (bidType) {
      case '':
        this.bidTitle = 'All';
        break;
      case 'NGR':
        this.bidTitle = 'National Gold Retail';
        break;
      case 'GR':
        this.bidTitle = 'Gold Retail';
        break;
      case 'live':
        this.bidTitle = 'Live ';
        break;
      case 'past':
        this.bidTitle = 'Past ';
        break;
      case 'goldRetail':
        this.bidTitle = 'Gold Retail';
        break;
      case 'mybid':
        this.bidTitle = 'My Bids';
        break;
      default:
        if (this.url == '/my_auctions')
          this.bidTitle = 'My Bids';
        else if (this.url == '/auctions_hosted')
          this.bidTitle = 'Gold Retail';
        else if (this.url == '/all_auctions')
          this.bidTitle = 'National Gold Retail';
        else if (this.url == '/user_retail')
          this.bidTitle = 'My Gold Retail';
        break;
    }
    this.LoadAuctionsList(this.bidType);
  }


  LoadAuctionsList = function (bidType, value) {
    // this.spinnerService.show();
    this.data.status = bidType;
    if (value) {
      this.data.page = 1;
    } else
      this.data.page = this.page;

    if (bidType == 'mybid') {
      this.data.created_myself = 2;
      delete this.data["status"];
    } else if (this.bidType == 'goldRetail') {
      this.data.created_myself = 1;
      delete this.data["status"];
    } else if (this.bidType == 'GR') {
      delete this.data["status"];
    } else if (this.bidType == 'NGR') {
      delete this.data["status"];
      this.data.created_myself = 0;
    }
    console.log(this.data, 'before');
    this.apiService._post('all_bids', this.data)
      .subscribe(result => {
        if (result.status === true) {
          this.success_message = result.message;
          console.log(result, 'result');
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.auctionsList.push(result.data[i]);
            }
          } else {
            this.loadMore = true;
            $(".nano").unbind("scrollend");
          }
        } else {
          this.error_message = result.message;
        }
      });
  }

  openModalForBuyTickets(curEvent) {
    this.child.currentEvent = curEvent;
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  onScrollDown = function () {
    // console.log('hereeee',this.page);
    console.log(this.page, 'before scroll');
    this.page = this.page + 1;
    console.log(this.page, 'after scroll');
    this.LoadAuctionsList(this.bidType, false);
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

  openModalForBuyBid(curBid) {
    var bidList = this.doCalc(curBid);
    this.child.bid = curBid;
    this.child.bidList = bidList;
    this.child.curBidAmount = bidList[0];
    if (this.user.consumer_stripe_account) {
      setTimeout(() => {
        let div = $("#bidModal");
        if (!div.length) return;
        div.modal({});
        div.modal("open");
      }, 1000);
    } else
      this.buyNow(curBid);
  }

  buyNow(curEvent) {
    this.child.currentEvent = curEvent;
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  bidDetails(bid_id) {
    this.router.navigate(['/auction-details'], { queryParams: { bid_id: bid_id } });
  }

}
