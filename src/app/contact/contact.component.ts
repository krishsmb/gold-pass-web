import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup,FormBuilder, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: any;
  public notification_message:string;
  public error_message:string;
  public mb_mask = [ '1','-',/[0-9]/, /\d/,/\d/, '-', /\d/, /\d/, /\d/,'-', /\d/, /\d/, /\d/, /\d/];
  
  
  constructor(public apiService : ApiService, private router : Router, private formBuilder: FormBuilder,private spinnerService: Ng4LoadingSpinnerService) {
    this.contactForm = this.formBuilder.group({
      'cn_name': ['', Validators.required],
      'cn_email': ['', [Validators.required,ValidationService.emailValidator]],
      'cn_number': ['', Validators.required],
      'cn_message':['']
    });
    console.log(this.contactForm.value);
  }
    
  ngOnInit() {
     window.scrollTo(0,0);
  }
  sendContact(){
    this.spinnerService.show();
    if (this.contactForm.dirty && this.contactForm.valid) {
      let data={name:this.contactForm.value.cn_name,
        email:this.contactForm.value.cn_email,
        contact_number:this.contactForm.value.cn_number.replace(/[ -]/g, ''),
        message:this.contactForm.value.cn_message
     };
      this.apiService._post('send_contact', data)
      .subscribe(result => {
          if (result['status'] === true) {                       
              this.notification_message=result['message'];
              this.spinnerService.hide();  
            setTimeout(()=>{    //<<<---    using ()=> syntax
              this.openContactNotification(); 
           },100);
             
          } else {
              this.error_message = result['message'];
              this.spinnerService.hide();
          }
      });
    }
  }

  openContactNotification(){
    let div  = $("#contactNotification") ;
    if(!div.length) return ;
    div.modal({});
    div.modal("open");

  }
  closeContactNotification() {
    let div  = $("#contactNotification") ;
    if(!div.length) return ;
   // div.modal({});
    div.modal("close");
    this.contactForm.reset();
  }

}
