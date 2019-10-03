import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';


declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-publicheader',
  templateUrl: './publicheader.component.html',
  styleUrls: ['./publicheader.component.css']
})
export class PublicheaderComponent implements OnInit {
  public user_id: any;
  public login: boolean;
  constructor(public apiService: ApiService, private router: Router, ) {
    if (this.apiService.isLoggedIn()) {
      this.user_id = this.apiService.isLoggedIn();
      console.log(this.user_id);
      let data = { user_id: this.user_id };
      this.apiService._post('user_details', data)
        .subscribe(result => {
          if (result['status'] === true) {
            this.login = true;
          } else {
            if (result['statusCode'] == 'TokenMissing') {
              this.login = false;
              //localStorage.clear();
            }
          }
        });

    }
    else {
      //this.router.navigate(['/home']);
      this.login = false;
    }
  }

  ngOnInit() {
    $(".button-collapse").sideNav();
  }

}
