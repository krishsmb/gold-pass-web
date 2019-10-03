import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCommonComponent } from '../user-common/user-common.component';
import { Broadcaster } from '../services/app.broadCaster';

declare var $: any;
@Component({
  selector: 'app-tgs-details',
  templateUrl: './tgs-details.component.html',
  styleUrls: ['./tgs-details.component.css']
})
export class TgsDetailsComponent implements OnInit {
  public user_id: number;
  public tgs_data: any = {};
  public common_message: string;
  public tgs_id: number;
  public confirmation_message: string;
  private sub: any;
  @ViewChild(UserCommonComponent) child;
  constructor(
      public apiService: ApiService,
      private router: Router,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      public broadcaster: Broadcaster
    ) {
    this.user_id = parseInt(localStorage.getItem('user_id'), 10);
    this.broadcaster.on<string>('forRefreshing')
      .subscribe(message => {
        this.tgs_data = {};
        this.tgsDetails();
      });
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.tgs_id = +params['tgs_id'] || 0;
        console.log(this.tgs_id);
        this.tgsDetails();
      });
  }

  openConfirmationModal() {
    let div = $('#confirmation_modal');
    this.confirmation_message = 'Are you sure you want to Cancel the TGS Hosted?'
    if (!div.length) return;
    div.modal({
      backdrop: 'static',
      keyboard: false
    });
    div.modal('open');
  }
  closeConfirmation() {
    let div = $('#confirmation_modal');
    if (!div.length) return;
    // div.modal({});
    div.modal('close');
  }

  publicProfile(creator_id) {
    if (creator_id !== this.user_id) {
      this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
    } else {
      return true;
    }
  }

  cancelMyTgs($event) {
    let data = {tgs_id: this.tgs_id };
    this.apiService._post('cancel_tgs', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.child.notification_message = result.message;
          this.openModalNotification();
        } else {
          this.common_message = "";
        }
      });
  }

  tgsDetails() {
    let data = { tgs_id: this.tgs_id };
    this.apiService._post('tgs_details', data)
      .subscribe(result => {

        if (result['status'] === true) {
          this.tgs_data = result['data'];
          console.log(this.tgs_data);
        } else {
          this.common_message = 'No Feeds';
        }

      });
  }

  openModalForSelectTgsPackages(curEvent){
    let div = $('#packageTypeModal');
    if(!div.length) return;
    div.modal({});
    div.modal('open');
  }

  closeModalForSelectTgsPackages() {
    let div = $('#packageTypeModal');
    if (!div.length) return;
    div.modal('close');
  }

  openModalForBuyTickets(curEvent, ticket_price, package_type = '') {
    let div1 = $('#packageTypeModal');
    if (div1.length) {
      div1.modal('close');
    }
    this.child.currentEvent = curEvent;
    this.child.currentEvent.ticket_price = ticket_price;
    this.child.currentEvent.package_type = package_type;
    console.log('TGS Price', this.child.currentEvent);
    let div = $('#buyTickets');
    if (!div.length) return;
    div.modal({});
    div.modal('open');
  }


  openModalNotification() {
    console.log('opened');
    $('#confirmation_modal').modal('close');
    let div = $('#modalNotification');
    if (!div.length) return;
    div.modal({});
    div.modal('open');

  }

}
