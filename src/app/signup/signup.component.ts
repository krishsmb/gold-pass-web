import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup,FormBuilder, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ValidationService } from '../services/validation.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  userForm: any;
  regForm: any;
  public email_reg:string;
  public error_message:string;
  public success_message:string;
  public notification_message:string;
  constructor(public apiService : ApiService, private router : Router,private formBuilder: FormBuilder,private spinnerService: Ng4LoadingSpinnerService) {
   

    this.regForm = this.formBuilder.group({
      'user_type': [1, Validators.required],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'user_name': ['', Validators.required],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'confirm_password': ['', [Validators.required,ValidationService.confirm_passwordValidator]],
      'tc': ['', Validators.required]
    });
  }

  ngOnInit() {
    $('select').material_select();
 
  
  }

  signUp(){
    this.spinnerService.show();
    var selectedCountry = $("#user_type option:selected").val();
    this.regForm.controls['user_type'].setValue(selectedCountry);
    //console.log(selectedCountry);
    //console.log(this.regForm.value.user_type);
    if (this.regForm.dirty && this.regForm.valid) {
      let data={first_name:this.regForm.value.first_name,
        last_name:this.regForm.value.last_name,
        user_name:this.regForm.value.user_name,
        email:this.regForm.value.email,
        password:this.regForm.value.password,
        user_type:this.regForm.value.user_type};
      this.apiService._post('sign_up', data)
      .subscribe(result => {
        console.log(result);
         // this.loading = false;
          if (result['status'] === true) {            
             this.spinnerService.hide();
             this.error_message ='';
             this.notification_message=result['message'];
             console.log(this.notification_message);
             this.openModalNotification();      
            
             
          } else {
              this.spinnerService.hide();
              this.error_message = result['message'];
              this.success_message = '';
              //this.loading = false;
              // this.user.password = "" ;
          }
      });
    } 
  }

  openModalNotification(){
    let div  = $("#modalNotification") ;
    if(!div.length) return ;
    div.modal({});
    div.modal("open");
  
  }
  closeNotification() {
    //this.regForm.reset();
    let div  = $("#modalNotification") ;
    if(!div.length) return ;
    div.modal("close");    
    
    this.router.navigate(['/home']);
  }

  // showPassword(type,$event){
  //   let ele = document.getElementById(type) ;
  //   if( !ele ) return ;
  //   let ispassword = ele.getAttribute("type") === "password" ;
  //   ele.setAttribute( "type" , ispassword ? "text" : "password" );
  //   return ( $event.returnValue = !1 ) ;
  // }
  showPassword(type,type2,$event){
    let ele = document.getElementById(type) ;
    let x = document.getElementById(type2).className;
    if(x == "fas fa-eye-slash"){
    document.getElementById(type2).classList.remove("fa-eye-slash");
    document.getElementById(type2).classList.add("fa-eye");
    }else {
    document.getElementById(type2).classList.remove("fa-eye");
    document.getElementById(type2).classList.add("fa-eye-slash");
    }
    if( !ele ) return ;
    let ispassword = ele.getAttribute("type") === "password" ;
    ele.setAttribute( "type" , ispassword ? "text" : "password" );
    return ( $event.returnValue = !1 ) ;
  }

}
