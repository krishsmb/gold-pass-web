import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  public error_message: string;
  public user: any={};


  constructor(private formBuilder: FormBuilder, public apiService: ApiService, private router: Router) { }


  ngOnInit() {
    this.form = this.formBuilder.group({
      user_name: [null, Validators.required],
      password: [null, Validators.required],
      //email: [null, [Validators.required, Validators.email]],
      // address: this.formBuilder.group({
      //   street: [null, Validators.required],
      //   street2: [null],
      //   zipCode: [null, Validators.required],
      //   city: [null, Validators.required],
      //   state: [null, Validators.required],
      //   country: [null, Validators.required]
      // })
    });

  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'has-error': this.isFieldValid(field),
      'has-feedback': this.isFieldValid(field)
    };
  }

  onSubmit() {
    console.log(this.form);
    if (this.form.valid) {
      console.log('form submitted');
      //this.apiService.login(this.form.value.name,this.form.value.password)
      this.apiService._post('login', this.form.value)
        .subscribe(result => {
          console.log(result);
          // this.loading = false;
          if (result['status'] === true) {
             //console.log(result['details']);
            // this.loading = false;
            localStorage.setItem("loggedIn", JSON.stringify(result['data']));
            localStorage.setItem("notification_count", JSON.stringify(result['notification_count']));
            localStorage.setItem("user_type", JSON.stringify(result['data'].user_type));
            localStorage.setItem("user_id", JSON.stringify(result['data'].user_id));
            localStorage.setItem("admin_verified_message_status", result['data'].admin_verified);
            setTimeout(function () {
              // $('select').material_select(); 
              this.router.navigate(['/home']);
            }, 200);

          } else {
            this.error_message = result['message'];
            //this.loading = false;
            // this.user.password = "" ;
          }
        });
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      console.log(field);
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  reset() {
    this.form.reset();
  }



}
