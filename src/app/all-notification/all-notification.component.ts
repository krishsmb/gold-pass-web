import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.css']
})
export class AllNotificationComponent implements OnInit {

  public user_id: number;
  public page: number;
  public notification_list: any = [];
  public common_message: string;
  constructor(public apiService: ApiService, private router: Router) {
    this.page = 1;
    this.user_id = parseInt(localStorage.getItem("user_id"));
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getNotifications();
    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      $(".nano").nanoScroller();
      // $(".nano").nanoScroller().bind("scrollend", (e)=> { 
      //   this.onScrollDown(); 
      // })

    }, 1000);

  }
  getNotifications() {
    let data = { user_id: this.user_id, page: this.page };
    this.apiService._post('notifications', data)
      .subscribe(result => {
        if (result.status === true) {

          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.notification_list.push(result.data[i]);
            }
          } else $(".nano").unbind("scrollend");

        } else {
          this.common_message = "No Feeds";
        }

      });
  }

  onScrollDown = function () {
    //console.log('hereeee',this.page);
    this.page = this.page + 1;
    this.getNotifications();

  }
  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  eventDetails(event_id) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: event_id } });
  }

  auctionDetails(bid_id) {
    this.router.navigate(['/auction-details'], { queryParams: { bid_id: bid_id } });
  }

  redirectToTgsDetails($ev, noti) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: noti.tgs_id } });
  }


}
