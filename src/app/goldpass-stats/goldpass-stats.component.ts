import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Subscription } from 'rxjs/Subscription';
import { UserCommonComponent } from '../user-common/user-common.component';
import { Broadcaster } from '../services/app.broadCaster';

declare var $: any;
@Component({
  selector: 'app-goldpass-stats',
  templateUrl: './goldpass-stats.component.html',
  styleUrls: ['./goldpass-stats.component.css']
})
export class GoldpassStatsComponent implements OnInit {
  public user_id: number;
  public feedList: any = [];
  public type: any;
  public title: any;
  public status: any;
  public loadMore: boolean;
  public user: any = {};
  public page: number;
  public noCard: boolean;
  public cardList: any = [];
  public url: string;
  public error_message: string;
  subscription: Subscription;
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router, public broadcaster: Broadcaster) {
    this.page = 1;
    this.type = ''; // type='' : all, type = 'event': Hosted Events, type='tgs': Hosted Tgs
    this.title = 'Gold Pass Stats';
    this.status = '';
    this.loadMore = false;
    this.error_message = '';
    this.user = JSON.parse(localStorage.getItem('loggedIn'));
    this.noCard = false;
    this.user_id = parseInt(localStorage.getItem('user_id'), 10);
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    this.getFeedList(false);
    setTimeout(function () {
      $('.dropdown-button').dropdown();
    }, 200);

    setTimeout(() => {
      $('.nano').nanoScroller();
      $('.nano').nanoScroller().bind('scrollend', (e) => {
        this.onScrollDown();
      });

    }, 100);
  }

  onScrollDown = function () {
    this.page = this.page + 1;
    this.getFeedList(false);
  };

  changeStatus(status = '') {
    this.status = status;
    this.getFeedList(true);
  }


  getFeedList = function (value) {
    this.data = {
      type: this.type,
      status: this.status
    };
    if (value) {
      this.data.page = 1;
    }else {
      this.data.page = this.page;
    }


    this.apiService._post('goldpass_stats', this.data)
      .subscribe(result => {
        if (result.status === true) {
          this.success_message = result.message;
          console.log('Stats Data', result.data);
          if (result.data.length > 0) {
            for (let i = 0; i < result.data.length; i++) {
              const venue = result.data[i].stats_data.venue.split('-');
              result.data[i].stats_data.venue = venue[0];
              this.feedList.push(result.data[i]);
            }
          } else {
            this.loadMore = true;
            $('.nano').unbind('scrollend');
          }
        } else {
          this.error_message = result.message;
        }
      });
  };

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  tgsDetails(tgs_id) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: tgs_id } });
  }

  eventDetails(event_id) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: event_id } });
  }

}
