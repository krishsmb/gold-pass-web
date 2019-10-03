import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { HttpInterceptorModule } from 'ng-http-interceptor';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
//import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoadingModule } from 'ngx-loading';
import { TruncateModule } from 'ng2-truncate';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
// import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { ImageCropperModule } from 'ngx-image-cropper';
// import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { RatingModule } from "ngx-rating";
import { TextMaskModule } from 'angular2-text-mask';
import { CapitalizeFirstPipe } from './test.pipe';


// Common HttpClient
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// Import your library
// import { NgxStripeModule } from 'ngx-stripe';
import * as moment from 'moment';






import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { FieldErrorDisplayComponent} from './field-error-display/field-error-display.component';
import { ApiService} from './services/api.service';
import { Broadcaster } from './services/app.broadCaster';
import { PublicheaderComponent } from './publicheader/publicheader.component';
import { PublicfooterComponent } from './publicfooter/publicfooter.component';
import { FormvalComponent } from './formval/formval.component';
import { ControlMessagesComponent} from './control-messages.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { LeftNaveComponent } from './left-nave/left-nave.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { UserCommonComponent } from './user-common/user-common.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MyMeetingComponent } from './my-meeting/my-meeting.component';
import { CelebrityProfileComponent } from './celebrity-profile/celebrity-profile.component';
import { ProfileHeadersComponent } from './profile-headers/profile-headers.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { MyGpEventsComponent } from './my-gp-events/my-gp-events.component';
import { SearchCelebrityComponent } from './search-celebrity/search-celebrity.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { BidDetailsComponent } from './bid-details/bid-details.component';
import { CorporeteLoginComponent } from './corporete-login/corporete-login.component';
import { EventIHostComponent } from './event-i-host/event-i-host.component';
import { AuctionsListComponent } from './auctions-list/auctions-list.component';
import { AllGpEventsComponent } from './all-gp-events/all-gp-events.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { LoginComponent} from './login/login.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {SlideshowModule} from 'ng-simple-slideshow';
import { AllTgsComponent } from './all-tgs/all-tgs.component';
import { TgsDetailsComponent } from './tgs-details/tgs-details.component';
import { GoldpassStatsComponent } from './goldpass-stats/goldpass-stats.component';
// import { CarouselModule } from 'angular4-carousel';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FieldErrorDisplayComponent,
    PublicheaderComponent,
    PublicfooterComponent,
    FormvalComponent,
    ControlMessagesComponent,
    MyHomeComponent,
    UserHeaderComponent,
    LeftNaveComponent,
    NotificationsComponent,
    SettingsComponent,
    UserCommonComponent,
    TestimonialsComponent,
    PublicProfileComponent,
    // ImageCropperComponent,
    EditProfileComponent,
    MyMeetingComponent,
    CelebrityProfileComponent,
    ProfileHeadersComponent,
    AllEventsComponent,
    MyGpEventsComponent,
    SearchCelebrityComponent,
    EventDetailsComponent,
    BidDetailsComponent,
    CorporeteLoginComponent,
    AllGpEventsComponent,
    EventIHostComponent,
    AuctionsListComponent ,
    CapitalizeFirstPipe,
    AboutComponent,
    ContactComponent,
    SignupComponent,
    MyProfileComponent,
    AllNotificationComponent,
    LoginComponent,
    FollowersComponent,
    FollowingComponent,
    AllTgsComponent,
    TgsDetailsComponent,
    GoldpassStatsComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpInterceptorModule,
    AsyncLocalStorageModule,
   // InfiniteScrollModule,
    LoadingModule,
    TruncateModule ,
    FormsModule,
    ImageCropperModule,
    RatingModule,
    TextMaskModule,
    HttpClientModule,
    // CarouselModule,
    Ng4GeoautocompleteModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    LazyLoadImageModule,
    SlideshowModule,   
  ],
  providers: [ApiService,Broadcaster],
  bootstrap: [AppComponent]
})
export class AppModule { }
