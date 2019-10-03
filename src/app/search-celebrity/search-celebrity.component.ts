import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { ValidationService } from '../services/validation.service';
import { UserCommonComponent } from "../user-common/user-common.component";
declare var $: any;
@Component({
  selector: 'app-search-celebrity',
  templateUrl: './search-celebrity.component.html',
  styleUrls: ['./search-celebrity.component.css']
})
export class SearchCelebrityComponent implements OnInit {
  public user_id: number;
  public page: number;
  public user: any = {};
  public keyword: string;
  public loadMore: boolean;
  public celebrityList: any = [];

  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router) {
    this.keyword = '';
    this.page = 1;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCelebrityList();
    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      // $('.dropdown-button').dropdown();
      $(".nano").nanoScroller();
      $(".nano").nanoScroller().bind("scrollend", (e) => {
        this.onScrollDown();
      })

    }, 100);
  }

  searchCelebrity($ev) {
    // console.log('hereeeeeeeeeeeee123');
    this.celebrityList = [];
    this.getCelebrityList();
  }

  onKeydown($ev) {
    this.celebrityList = [];
    this.getCelebrityList();
  }

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  getCelebrityList() {
    let data = {
      user_id: this.user.user_id,
      page: this.page,
      search_key: this.keyword
    }
    this.apiService._post('celebrity_lists', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;
          console.log('count_of_celebrity', result.data.length);
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.celebrityList.push(result.data[i]);
            }
          } else {

            this.loadMore = true;
          }


        } else {
          // this.error_message = result.message;

        }
      });
  }

  openModalNotification() {
    let div = $("#modalNotification");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  followMe(list, follow) {
    let data = {
      user_id: this.user.user_id,
      celebrity_id: list.user_id,
      follow: follow
    }
    this.apiService._post('start_follow', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;

          for (let i = 0; i < this.celebrityList.length; i++) {
            if (this.celebrityList[i].user_id == list.user_id)
              this.celebrityList[i].following = follow;
          }
          let msg = '';
          if (follow)
            msg = "Started following " + list.first_name + " " + list.last_name;
          else
            msg = "Unfollowed " + list.first_name + " " + list.last_name;
          this.child.notification_message = msg;
          this.openModalNotification();


        } else {
          // this.error_message = result.message;

        }
      });
  }

  closeSearch($ev) {
    this.celebrityList = [];
    this.keyword = '';
    let data = {
      user_id: this.user.user_id,
      page: this.page,
      search_key: this.keyword
    }
    this.apiService._post('celebrity_lists', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.celebrityList.push(result.data[i]);
            }
          } else {
            $(".nano").unbind("scrollend");
            this.loadMore = true;
          }


        } else {
          // this.error_message = result.message;

        }
      });
  }

  onScrollDown = function () {
    // console.log('hereeee',this.page);
    this.page = this.page + 1;
    this.getCelebrityList();
  }

}
