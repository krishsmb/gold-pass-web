import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';
import { UserCommonComponent } from "../user-common/user-common.component";
declare var $: any;
@Component({
  selector: 'app-all-gp-events',
  templateUrl: './all-gp-events.component.html',
  styleUrls: ['./all-gp-events.component.css']
})
export class AllGpEventsComponent implements OnInit {
  public error_message: string;
  public success_message: string;
  public user_id: number;
  public eventList: any = [];
  public eventType: string;
  public eventTitle: string;
  public loadMore: boolean;
  public user: any = {};
  public page: number;
  public currentEvent: any;
  public noCard: boolean;
  public cardList: any = [];
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router) {
    this.page = 0;
    this.eventType = 'all';
    this.eventTitle = 'Nationwide Gold Events';
    this.loadMore = false;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
    //  console.log('user',this.user);
    //  console.log(this.router,'abcdefghijklmnopqrstuvwxyz');
    this.noCard = false;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.LoadMeetingList('all');
    // setTimeout(function() {
    //   $('.dropdown-button').dropdown();
    // }, 200);
    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      $('.dropdown-button').dropdown();
      $(".nano").nanoScroller();
      $(".nano").nanoScroller().bind("scrollend", (e) => {
        this.onScrollDown();
      })

    }, 100);


  }


  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  changeEventType = function (eventType) {
    this.loadMore = false;
    this.eventType = eventType;
    this.page = 0;
    this.eventList = [];

    switch (eventType) {
      case 'all':
        this.eventTitle = 'All Events';
        this.created_myself = 0;
        break;
      case 'personal':
        this.eventTitle = 'Personal Gold Events';
        this.created_myself = 2;
        break;
      case 'eventsHosted':
        this.eventTitle = 'Gold Events Hosted';
        this.created_myself = 1;
        break;
      default:
        this.eventTitle = 'Nationwide Gold Events';
    }
    this.LoadMeetingList(this.eventType);
  }


  LoadMeetingList = function (eventType) {
    // this.spinnerService.show();
    let data = {
      user_id: this.user_id,
      created_myself: this.created_myself,
      page: this.page
    };
    this.apiService._post('all_events', data)
      .subscribe(result => {
        if (result.status === true) {
          this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.eventList.push(result.data[i]);
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

  eventDetails(event_id) {
    this.router.navigate(['/event-details'], { queryParams: { event_id: event_id } });
  }

  onScrollDown = function () {
    this.page = this.page + 1;
    this.LoadMeetingList(this.eventType);

  }


}
