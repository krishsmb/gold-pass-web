import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { ValidationService } from '../services/validation.service';
import { UserCommonComponent } from "../user-common/user-common.component";
declare var $: any;
@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  public user_id: number;
  public page: number;
  public user: any = {};
  public keyword: string;
  public loadMore: boolean;
  public followingList: any = [];

  @ViewChild(UserCommonComponent) child;
  constructor(public apiService: ApiService, private router: Router) {
    this.keyword = '';
    this.page = 0;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getFollowingList();
    setTimeout(() => {    //<<<---    using ()=> syntax
      // this.openContactNotification(); 
      // $('.dropdown-button').dropdown();
      // $(".nano").nanoScroller();
      // $(".nano").nanoScroller().bind("scrollend", (e)=> { 
      //       this.onScrollDown(); 
      // })

    }, 100);
  }

  searchCelebrity($ev) {
    // console.log('hereeeeeeeeeeeee123');
    this.followingList = [];
    this.getFollowingList();
  }

  publicProfile(creator_id) {
    this.router.navigate(['/public-profile'], { queryParams: { creator_id: creator_id } });
  }

  getFollowingList() {
    let data = {
      user_id: this.user.user_id,
      search_key: this.keyword
    }
    this.apiService._post('followers_list', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.followingList.push(result.data[i]);
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


  onKeydown($ev) {
    this.followingList = [];
    this.getFollowingList();
  }


  closeSearch($ev) {
    // console.log('hereeeeeeeee');
    this.keyword = '';
    let data = {
      user_id: this.user.user_id,
      page: this.page,
      search_key: this.keyword
    }
    this.apiService._post('followers_list', data)
      .subscribe(result => {
        if (result.status === true) {
          //  this.success_message = result.message;
          if (result.data.length) {
            for (let i = 0; i < result.data.length; i++) {
              this.followingList.push(result.data[i]);
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

  // onScrollDown = function(){
  //   // console.log('hereeee',this.page);
  //   this.page = this.page+1;
  //   this.getFollowingList();
  // }


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

          for (let i = 0; i < this.followingList.length; i++) {
            if (this.followingList[i].user_id == list.user_id) {
              this.followingList[i].following = follow;
              this.followingList[i].is_follow = follow;
              // this.followingList.splice(i,1);
            }

          }
          let msg = '';
          if (follow)
            msg = "You have successfully followed " + list.first_name + " " + list.last_name;
          else
            msg = "You have successfully unfollowed " + list.first_name + " " + list.last_name;
          this.child.notification_message = msg;
          this.openModalNotification();


        } else {
          // this.error_message = result.message;

        }
      });
  }
}
