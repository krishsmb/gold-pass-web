import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { UserCommonComponent } from '../user-common/user-common.component';
import { Broadcaster } from '../services/app.broadCaster';

declare var $: any;
@Component({
  selector: 'app-all-tgs',
  templateUrl: './all-tgs.component.html',
  styleUrls: ['./all-tgs.component.css']
})
export class AllTgsComponent implements OnInit {
  public error_message: string;
  public success_message: string;
  public user_id: number;
  public tgsList: any = [];
  public tgsType: string;
  public tgsTitle: string;
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
  public defaultImage: any;
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router, public broadcaster: Broadcaster) {
    this.page = 1;
    this.tgsType = '';
    this.loadMore = false;
    this.user = JSON.parse(localStorage.getItem('loggedIn'));
    this.noCard = false;
    this.user_id = parseInt(localStorage.getItem('user_id'), 10);

    this.url = this.router.url;
    switch (this.router.url) {
      case '/all-tgs':
        this.data = {
          created_myself: 0,
          status: this.tgsType,
          page: this.page,
        };
        this.tgsTitle = 'National Gold TGS';
        break;
      case '/my-tgs':
        this.data = {
          created_myself: 2,
          status: this.tgsType,
          page: this.page
        };
        this.tgsTitle = 'My Gold TGS Events';
        break;
      case '/tgs-hosted':
        this.data = {
          created_myself: 1,
          status: this.tgsType,
          page: this.page
        };
        this.tgsTitle = 'My Gold TGS Retails';
        break;
    }
    // For LazyLoad
    this.defaultImage = 'assets/img/loader1.gif';
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    this.LoadTgsList(false);
    setTimeout(function () {
      $('.dropdown-button').dropdown();
    }, 200);

    setTimeout(() => { // <<<---    using ()=> syntax
      // this.openContactNotification();
      $('.nano').nanoScroller();
      $('.nano').nanoScroller().bind('scrollend', (e) => {
        this.onScrollDown();
      });

    }, 100);
  }

  onScrollDown = function () {
    console.log(this.page, 'before scroll');
    this.page = this.page + 1;
    console.log(this.page, 'after scroll');
    this.LoadTgsList(false);
  };

  LoadTgsList = function (value) {
    if (value) {
      this.data.page = 1;
    }else {
      this.data.page = this.page;
    }

    this.apiService._post('all_tgs', this.data)
      .subscribe(result => {
        if (result.status === true) {
          this.success_message = result.message;
          // console.log(result, 'result');
          if (result.data.length > 0) {
            for (let i = 0; i < result.data.length; i++) {
              const venue = result.data[i].venue.split('-');
              // console.log('Venue', venue);
              result.data[i].venue = venue[0];
              this.tgsList.push(result.data[i]);
            }
            console.log('TGS => ', this.tgsList);
          } else {
            this.loadMore = true;
            $('.nano').unbind('scrollend');
          }
        } else {
          this.error_message = result.message;
        }
      });
  };

  changeTgsType = function (tgsType) {

    this.loadMore = false;
    this.page = 1;
    this.tgsList = [];
    this.tgsType = tgsType;
    this.data.status = tgsType;
    this.LoadTgsList(false);
  };

  tgsDetails(tgs_id) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: tgs_id } });
  }

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

}
