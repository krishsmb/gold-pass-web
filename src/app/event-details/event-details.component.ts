import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { RatingModule } from 'ngx-rating';
import { ApiService } from '../services/api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCommonComponent } from "../user-common/user-common.component";

declare var $: any;
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  public user_id: number;
  public event_data: any = {};
  public common_message: string;
  public event_id: number;
  public confirmation_message: string;
  private sub: any;
  public testimonial: any = {rating: 0, review: '', readonly: false};
  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.user_id = parseInt(localStorage.getItem("user_id"));
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.event_id = +params['event_id'] || 0;
        console.log(this.event_id);
        this.eventDetails();
      });
  }

  openConfirmationModal() {
    let div = $("#confirmation_modal");
    this.confirmation_message = "Are you sure you want to Cancel the Gold Event Hosted?"
    if (!div.length) return;
    div.modal({
      backdrop: 'static',
      keyboard: false
    });
    div.modal("open");
  }
  closeConfirmation() {
    let div = $("#confirmation_modal");
    if (!div.length) return;
    // div.modal({});
    div.modal("close");
  }

  publicProfile(creator_id) {
    if (creator_id != this.user_id) {
      this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
      this.router
    } else {
      return true;
    }
  }

  cancelMyEvent($event) {
    let data = { user_id: this.user_id, event_id: this.event_id };
    this.apiService._post('cancel_event', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.child.notification_message = result.message;
          this.openModalNotification();
        } else {
          this.common_message = "";
        }
      });
    //  if(confirm("Are you sure to cancel this event ")) {
    //   this.apiService._post('cancel_event', data)
    //     .subscribe(result => {
    //       if (result['status'] === true) {
    //           this.child.notification_message = result.message;
    //           this.openModalNotification();
    //       } else {
    //           this.common_message="";
    //       }
    //     });
    //   }

  }

  eventDetails() {
    let data = { user_id: this.user_id, event_id: this.event_id };
    this.apiService._post('event_details', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.event_data = result['data'];
          this.testimonial.rating = result['data'].rating && typeof result['data'].rating !== 'undefined' ? result['data'].rating : 0;
          this.testimonial.review = result['data'].review && typeof result['data'].review !== 'undefined' ? result['data'].review : '';
          this.testimonial.readonly = result['data'].rating === 0 && result['data'].review === '' ? false : true;
        } else {
          this.common_message = 'No Feeds';
        }

      });
  }




  /**
   * for buy tickets
   */

  openModalForBuyTickets(curEvent) {
    this.child.currentEvent = curEvent;
    const div = $('#buyTickets');
    if (!div.length) { return; }
    div.modal({});
    div.modal('open');
  }


  openModalNotification() {
    if ($('#confirmation_modal').is(':visible')) {
      $('#confirmation_modal').modal('close');
    }
    const div = $('#modalNotification');
    if (!div.length) { return; }
    div.modal({});
    div.modal('open');

  }

  submitOvation(event_id) {
    // console.log('Review: ', this.testimonial.rating, this.testimonial.review);
    const data = {
      meeting_id: event_id,
      rating: this.testimonial.rating,
      review: this.testimonial.review,
      user_id: this.user_id
    };
    this.apiService._post('post_testimonial', data)
      .subscribe(result => {
        console.log('Result submitOvation: ', result);
        if (result.status === true) {
          this.child.notification_message = result.message;
          this.openModalNotification();
          this.event_data.rating = this.testimonial.rating;
          this.event_data.review = this.testimonial.review;
          this.testimonial.readonly = true;

        }else {
          this.child.notification_message = result.message;
          this.openModalNotification();
        }
      });
  }
}
