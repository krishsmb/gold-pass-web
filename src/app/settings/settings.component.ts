import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';


declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  cpForm: any;
  newcardForm: any;
  public error_message: string;
  public success_message: string;
  public user_id: number;
  public cards: any = [];
  public noCard: boolean;
  public cardSuccess = false;
  public ticket_purchase_notification: boolean;
  public bid_placed_notification: boolean;
  public testimonial_added_notification: boolean;
  public mask = [/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public exp_date_mask = [/[0-1]/, /\d/, '/', '2', '0', /[0-9]/, /[0-9]/];
  public cvc_mask = [/[1-9]/, /\d/, /\d/];
  public user: any = {};
  public successcard_message: '';
  public errorCard_message: '';
  public dateError: any;
  public exp_month: number;
  public exp_year: number;
  public cardError: any;
  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
    this.noCard = false;
    this.cpForm = this.formBuilder.group({
      'old_password': ['', Validators.required],
      'new_password': ['', Validators.required],
      'confirm_password': ['', [Validators.required, ValidationService.setting_confirm_passwordValidator]]
      //'profile': ['', [Validators.required, Validators.minLength(10)]]
    });
    this.newcardForm = this.formBuilder.group({
      'card_number': ['', [Validators.required, ValidationService.creditCardValidator]],
      'name': ['', [Validators.required]],
      'expiration_date': ['', [Validators.required]],
      'cvc': ['', [Validators.required]]
      //'profile': ['', [Validators.required, Validators.minLength(10)]]
    });

    setTimeout(() => {
      this.getCards();
    }, 2000);
  }

  ngOnInit() {

    this.success_message = "";
    // this.user = JSON.parse(localStorage.getItem('loggedIn'));
    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.userDetails();
    setTimeout(function () {
      $('.collapsible').collapsible();
    }, 20);



  }
  changePassword() {

    if (this.cpForm.dirty && this.cpForm.valid) {
      let data = {
        old_password: this.cpForm.value.old_password,
        password: this.cpForm.value.new_password,
        confirm_pass: this.cpForm.value.confirm_password,
        user_id: this.user_id
      };
      this.apiService._post('change_password', data)
        .subscribe(result => {
          if (result['status'] === true) {
            this.success_message = result['message'];
            this.error_message = "";
            this.cpForm.reset();
          } else {
            this.error_message = result['message'];

          }
        });
    }
  }

  /**
   * 
   * for eye icon functionality
   */

  showPassword(type, type2, $event) {
    let ele = document.getElementById(type);
    let x = document.getElementById(type2).className;
    if (x == "fas fa-eye-slash") {
      document.getElementById(type2).classList.remove("fa-eye-slash");
      document.getElementById(type2).classList.add("fa-eye");
    } else {
      document.getElementById(type2).classList.remove("fa-eye");
      document.getElementById(type2).classList.add("fa-eye-slash");
    }
    if (!ele) return;
    let ispassword = ele.getAttribute("type") === "password";
    ele.setAttribute("type", ispassword ? "text" : "password");
    return ($event.returnValue = !1);
  }

  getCards() {
    let data = {
      user_id: this.user_id
    };
    this.apiService._post('get_cards', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.cards = result['cards'];
          //  this.success_message = result['message'];
          this.error_message = "";
        }
      });
  }

  changeSetting() {
    if (this.ticket_purchase_notification) {
      var tp_notification = 'Y';
    } else {
      var tp_notification = 'N';
    }
    if (this.bid_placed_notification) {
      var bp_notification = 'Y';
    } else {
      var bp_notification = 'N';
    }
    if (this.testimonial_added_notification) {
      var ta_notification = 'Y';
    } else {
      var ta_notification = 'N';
    }
    let data = {
      ticket_purchase_notification: tp_notification,
      bid_placed_notification: bp_notification,
      testimonial_added_notification: ta_notification,
      user_id: this.user_id
    };
    this.apiService._post('update_notification_settings', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.success_message = result['message'];
          this.error_message = "";
        } else {
          this.error_message = result['message'];

        }
      });
  }

  deleteCard($ev, card) {
    let data = { card_id: card.id, user_id: this.user_id };
    this.apiService._post('delete_cards', data)
      .subscribe(result => {
        if (result['status'] === true) {

          this.successcard_message = result['message'];
          this.errorCard_message = "";
          for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id == card.id)
              this.cards.splice(i, 1);
          }
          setTimeout(() => {
            // this.getCards();
            this.successcard_message = '';
            this.errorCard_message = "";
          }, 2000);
          //  this.cpForm.reset();
        } else {
          this.errorCard_message = result['message'];
          setTimeout(() => {
            // this.getCards();
            this.successcard_message = '';
            this.errorCard_message = "";
          }, 2000);

        }
      });
  }

  userDetails() {
    this.user_id = parseInt(localStorage.getItem("user_id"));

    let data = { user_id: this.user_id };
    this.apiService._post('user_details', data)
      .subscribe(result => {
        console.log(result);
        if (result['status'] === true) {
          this.user = result['data'];
          if (this.user.testimonial_added_notification == 'Y') {
            this.testimonial_added_notification = true;
          } else {
            this.testimonial_added_notification = false;
          }
          console.log(this.testimonial_added_notification);
          if (this.user.bid_placed_notification == 'Y') {
            this.bid_placed_notification = true;
          } else {
            this.bid_placed_notification = false;
          }
          if (this.user.ticket_purchase_notification == 'Y') {
            this.ticket_purchase_notification = true;
          } else {
            this.ticket_purchase_notification = false;
          }

        } else {

        }


      });
  }

  checkdate(curDate) {
    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth() + 1;
    // get parts of the expiration date
    var parts = curDate.split('/');
    var year = parseInt(parts[1]);
    var month = parseInt(parts[0]);
    // compare the dates
    if ((year < currentYear || (year == currentYear && month < currentMonth)) || (!curDate.match(/(0[1-9]|1[0-2])[/][0-9]{2}/))) {
      return true;
    } else {
      this.exp_month = month;
      this.exp_year = year;
      return false;
    }
  }

  addCard() {
    debugger;
    this.spinnerService.show();
    this.dateError = ''
    var dateValid = this.checkdate(this.newcardForm.value.expiration_date);
    if (dateValid) {
      this.dateError = "Invalid Expiry date";
      this.spinnerService.hide();
    } else {
      this.dateError = '';
      let url = "";
      (<any>window).Stripe.card.createToken({
        number: parseInt(this.newcardForm.value.card_number.replace(/[ -]/g, '')),
        exp_month: this.exp_month,
        exp_year: this.exp_year,
        cvc: parseInt(this.newcardForm.value.cvc),
        name: this.newcardForm.value.name
      }, (status: number, response: any) => {
        console.log("token", response.id);
        if (this.user.consumer_stripe_account) {
          // var token = this.createToken('add_cards');
          url = "add_cards";
        } else {
          //var token = this.createToken('create_consumer_stripe_account');
          url = "create_consumer_stripe_account";
        }
        let data = {};
        data = {
          user_id: this.user.user_id,
          stripe_token: response.id
        };
        this.apiService._post(url, data)
          .subscribe(result => {
            if (result.status === true) {
              this.spinnerService.hide();
              if (result.status) {
                this.noCard = false;
                this.cards.push(result.data);
                this.user.consumer_stripe_account = true;
                this.cardSuccess = true;
                $(".collapsible-body").hide();
                setTimeout(function () {
                  this.cardSuccess = false;
                }, 500)
              } else {
                this.cardError = result.error.message;
              }
            }
          });
      });
    }
  }

  creatCard() {
    this.dateError = ''
    var dateValid = this.checkdate(this.newcardForm.value.expiration_date);
    if (dateValid) {
      this.dateError = "Invalid Expiry date";
    }
    // else {
    //   this.dateError = '';
    //   this.tokenDetails = {
    //     cardNumber:this.cardDetails.value.card_num.replace(/[ -]/g, ''),
    //     cvc:this.cardDetails.value.cvc,
    //     name:this.cardDetails.value.name,
    //     exp_month:this.exp_month,
    //     exp_year:this.exp_year
    //   }
    //   if(this.user.consumer_stripe_account) {
    //     var token = this.createToken('add_cards');
    //   } else {
    //     var token = this.createToken('create_consumer_stripe_account');
    //   }
    // }

  }




}
