import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RatingModule } from "ngx-rating";
import { FormGroup,FormsModule , ReactiveFormsModule  } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {
  public error_message:string;
  public success_message:string;
  public user_id:number;
  public testimonials : any =[];
  public user:any={};
  constructor(public apiService : ApiService, private router : Router) { 
   
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.user_id=parseInt(localStorage.getItem("user_id")); 
    this.getAllTestimonials();
  }
  test(testtttt){
    console.log('444444',testtttt);
  }
  getAllTestimonials = function(){
    
      let data={
        user_id:this.user_id
      };
     this.apiService._post('get_testimonials', data)
     .subscribe(result => {
     
         if (result.status === true) {
           
            this.testimonials = result.data;
           
         } else {
             this.error_message = result.message;
            
         }
     });
  }

}
