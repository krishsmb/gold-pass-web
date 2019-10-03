import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RatingModule } from "ngx-rating";
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
declare var $: any;


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public user_id: any;
  public profile_info: any = {};
  public tgs_list: any = [];
  public events_attented_list: any = [];
  public testimonials: any = [];

  public meetingType: any;
  public page: number;
  public loadMore: boolean;
  public meetingSec: boolean;
  public bidSec: boolean;
  public eventList: any = [];
  public auctionsList: any = [];
  public defaultImage : any;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.page = 1;
    this.loadMore = true;
    this.meetingSec = true;
    this.meetingType = "open";
    this.bidSec = false;
     //For LazyLoad
     this.defaultImage = 'assets/img/loader1.gif';
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.profileDetails();
    $('.tabs').tabs();
  }


  profileDetails() {
    //this.celebrity_id=440;
    this.user_id = parseInt(localStorage.getItem("user_id"));
    let data = { user_id: this.user_id };
    this.apiService._post('my_profile', data)
      .subscribe(result => {
        console.log(result);
        if (result['status'] === true) {
          this.profile_info = result['data'];
          this.tgs_list = result['tgs_list'];
          this.events_attented_list = result['events_attented_list'];
          this.testimonials = result['testimonials'];
        } else {

        }
      });
  }

  bidDetails(bid_id) {
    this.router.navigate(['/auction-details'], { queryParams: { bid_id: bid_id } });
  }

  tgsDetails(tgs_id) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: tgs_id } });
  }

  getFollowingList() {
    this.router.navigate(['/following']);
  }
  getFollowersList() {
    this.router.navigate(['/my_followers'])
  }



}
