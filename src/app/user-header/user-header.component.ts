import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from '../services/api.service';
declare var $: any;
@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {
  public user_id: any;
  public user: any = {};
  subscription: Subscription;
  constructor(public apiService: ApiService, private router: Router, ) {
    if (this.apiService.isLoggedIn()) {
      this.user_id = this.apiService.isLoggedIn();
      console.log(this.user_id);

    }
    else {
      this.router.navigate(['/home']);
    }
    this.subscription = this.apiService.doneSetting().subscribe(message => { if (message) this.userDetails(); });
  }

  ngOnInit() {
    this.userDetails();
    setTimeout(() => {    //<<<---    using ()=> syntax
      $('.dropdown-button').dropdown();
    }, 200);
  }
  userDetails() {
    // this.user_id = parseInt(localStorage.getItem("user_id"));  

    let data = { user_id: this.user_id };
    this.apiService._post('user_details', data)
      .subscribe(result => {
        //console.log(result);
        if (result['status'] === true) {
          this.user = result['data'];
        } else {
          if (result['statusCode'] == 'TokenMissing') {
            localStorage.clear();
            //this.router.navigate(['/home']);
            window.location.href = '/home';

          }
        }
      });
  }
  logOut() {
    localStorage.clear();
    window.location.href = '/goldpass/web/';
    //window.location.href='/home';

  }

}
