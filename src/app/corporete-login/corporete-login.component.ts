import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-corporete-login',
  templateUrl: './corporete-login.component.html',
  styleUrls: ['./corporete-login.component.css']
})
export class CorporeteLoginComponent implements OnInit {
  userForm: any;
  public email_reg: string;
  public error_message: string;
  public success_message: string;
  public reset: boolean;
  public get_id: any;
  public notification_message: string;

  constructor(public apiService: ApiService, private router: Router, private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) {
    this.userForm = this.formBuilder.group({
      'company_name': ['', Validators.required],
      'company_email': ['', [Validators.required, ValidationService.emailValidator]],
      'user_name': ['', Validators.required],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'confirm_password': ['', [Validators.required, ValidationService.confirm_passwordValidator]]
      //'profile': ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  ngOnInit() {
    $("[data-show]").bind("click", function (e) {
      var target = $(this).attr("data-show"),
        ele = $(target);
      if (!target.length || ele.hasClass("active"))
        return;

      $(this).parents(".signup-switch")
        .find("a.active").removeClass("active");

      $(this).addClass("active");

      $(".login-tab").removeClass("active");
      ele.addClass("active")

    });
  }

  closeCorporate() {
    //document.getElementById("myNav").style.display = "none";
    console.log("close event");
    this.router.navigate(['/home']);

  }

  saveUser() {
    this.spinnerService.show();
    if (this.userForm.dirty && this.userForm.valid) {
      //alert(`Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`);
      let data = {
        first_name: this.userForm.value.company_name,
        last_name: "company",
        user_name: this.userForm.value.user_name,
        email: this.userForm.value.company_email,
        password: this.userForm.value.password,
        user_type: 3
      };
      this.apiService._post('sign_up', data)
        .subscribe(result => {
          if (result['status'] === true) {
            this.spinnerService.hide();
            this.error_message = '';
            this.notification_message = result['message'];
            this.openModalNotification();
          } else {
            this.error_message = result['message'];
            this.spinnerService.hide();

          }
        });
    }
  }

  openModalNotification() {
    let div = $("#modalNotification");
    if (!div.length) return;
    div.modal({});
    div.modal("open");

  }
  closeNotification() {
    let div = $("#modalNotification");
    if (!div.length) return;
    div.modal("close");
    this.userForm.reset();
    this.router.navigate(['/home']);
  }


}
