import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
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
  }
  getNotifications() {
    let data = { user_id: this.user_id, page: this.page, limit: 5, status: 'home' };
    this.apiService._post('notifications', data)
      .subscribe(result => {
        if (result.status === true) {
          this.notification_list = result.data;
          // this.error_message = "";
        } else {
          this.common_message = "No Feeds";
        }

      });
  }

  redirectToEventDetails($ev, noti) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: noti.event_id } });
  }

  redirectToTgsDetails($ev, noti) {
    this.router.navigate(['/tgs-details'], { queryParams: { tgs_id: noti.tgs_id } });
  }

  redirectToBidDetails($ev, noti) {
    this.router.navigate(['/auction-details'], { queryParams: { bid_id: noti.bid_id } });
  }

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  clearNotification(noti) {
    console.log('Noti', noti);
    this.apiService._post('clear_notification', {notification_id: noti.id}).subscribe(result => {
      if (result.status === true) {
        this.notification_list.splice(this.notification_list.indexOf(noti), 1);
      }
    });
  }
}
