import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,SelectControlValueAccessor } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { ApiService } from '../services/api.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-publicfooter',
  templateUrl: './publicfooter.component.html',
  styleUrls: ['./publicfooter.component.css']
})
export class PublicfooterComponent implements OnInit {
  userForm: any;
  regForm: any;
  forgotForm: any;
  resetForm: any;
  template: string = `<img class="custom-spinner-template" src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif">`;
  public email_reg:string;
  public error_message:string;
  public success_message:string;
  public reset:boolean;
  public get_id:any;
  public notification_message:string;
  public notification_type:number;
  // public  states = [
  //   {name: 'Arizona', abbrev: 'AZ'},
  //   {name: 'California', abbrev: 'CA'},
  //   {name: 'Colorado', abbrev: 'CO'},
  //   {name: 'New York', abbrev: 'NY'},
  //   {name: 'Pennsylvania', abbrev: 'PA'},
  // ];
  // public  state:any;
 

  constructor(public apiService : ApiService, private router : Router,private formBuilder: FormBuilder,private spinnerService: Ng4LoadingSpinnerService) {
   

    this.regForm = this.formBuilder.group({
      'user_type': [1, Validators.required],
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'user_name': ['', Validators.required],
      'password': ['', [Validators.required, ValidationService.passwordValidator]],
      'confirm_password': ['', [Validators.required,ValidationService.confirm_passwordValidator]]
      //'profile': ['', [Validators.required, Validators.minLength(10)]]
    });

    this.forgotForm = this.formBuilder.group({
      'email_id': ['', [Validators.required, ValidationService.emailValidator]],
     
    });
    this.resetForm = this.formBuilder.group({
      'reset_code': ['', Validators.required],
      'new_password': ['', [Validators.required, ValidationService.passwordValidator]],
      'cnf_password': ['', [Validators.required, ValidationService.cn_passwordValidator ]]
      //'email_reg': ['', [Validators.required, ValidationService.emailValidator]],
      
     
    });
    

   }

  ngOnInit() {
    $("[data-show]").bind("click",function(e){
      var target = $(this).attr("data-show"),
          ele = $(target) ;
          if(!target.length || ele.hasClass("active"))
              return ;
  
             $(this).parents(".signup-switch")
             .find("a.active").removeClass("active");
  
             $(this).addClass("active");
             
              $(".login-tab").removeClass("active");
              ele.addClass("active")
  
  });
 
  
  }
  filterChanged(selectedValue:string){
    console.log('value is ',selectedValue);
 
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

closeUserNav() {
  document.getElementById("userNav").style.display = "none";
}
closeForgotNav(){
  this.error_message = ""; 
  document.getElementById("forgotNav").style.display = "none";  
  this.forgotForm.reset();
 
 

}
forgotPassword(){
  this.spinnerService.show();
  let data={email:this.forgotForm.value.email_id};
  this.apiService._post('forgot_password', data)
  .subscribe(result => {
    console.log(result);
      if (result['status'] === true) {
        this.get_id=result['user_id'];
          // console.log(result['details']);
         // this.loading = false;
         this.error_message = "";  
         this.spinnerService.hide();
         this.reset=true;
         
       
      } else {
          this.error_message = result['message'];          
          this.spinnerService.hide();
          this.reset=false;
          //this.loading = false;
          // this.user.password = "" ;
      }
  });
}

resetPassword(){
  this.spinnerService.show();
  let data={otp_code:this.resetForm.value.reset_code,
  password:this.resetForm.value.new_password,
  user_id:this.get_id};
  this.apiService._post('reset_password', data)
  .subscribe(result => {
    console.log(result);
      if (result['status'] === true) {
        this.spinnerService.hide();
        this.notification_message=result['message'];
        this.reset=false;
        this.notification_type=1;
        this.openResetNotification();
        this.spinnerService.hide();

          // console.log(result['details']);
         // this.loading = false;
        // this.stage=2;
       
      } else {
          this.notification_type=2;
          this.notification_message = result['message'];
          this.openResetNotification();
          this.spinnerService.hide();

         
      }
  });
}
closeNav() {
  document.getElementById("myNav").style.display = "none";
}

openModalNotification(){
  let div  = $("#modalNotification") ;
  if(!div.length) return ;
  div.modal({});
  div.modal("open");

}
closeNotification() {
  let div  = $("#modalNotification") ;
  if(!div.length) return ;
  div.modal("close");
  this.resetForm.reset();
  //this.router.navigate(['/home']);
  this.closeForgotNav();  
  this.closeUserNav();
  this.regForm.reset();
  this.userForm.reset();
}
openResetNotification(){
 
  let div  = $("#resetNotification") ;
  if(!div.length) return ;
  div.modal({});
  div.modal("open");

}
closeResetNotification() {

  if(this.notification_type==1){
   // this.resetForm.reset();
    //document.getElementById("forgotNav").style.display = "none";  
    location.reload();
  }
  let div  = $("#resetNotification") ;
  if(!div.length) return ;
  div.modal("close");
  
}


}

