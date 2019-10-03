import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormvalComponent } from './formval/formval.component';
import { MyHomeComponent } from './my-home/my-home.component';
import { SettingsComponent } from './settings/settings.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PublicProfileComponent  } from './public-profile/public-profile.component';
import { MyMeetingComponent } from './my-meeting/my-meeting.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { SearchCelebrityComponent } from './search-celebrity/search-celebrity.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { BidDetailsComponent } from './bid-details/bid-details.component';
import { CorporeteLoginComponent} from './corporete-login/corporete-login.component';
import { AllGpEventsComponent } from './all-gp-events/all-gp-events.component';
import { EventIHostComponent } from './event-i-host/event-i-host.component';
import { AuctionsListComponent } from './auctions-list/auctions-list.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent} from './contact/contact.component';
import { SignupComponent} from './signup/signup.component';
import { MyProfileComponent} from './my-profile/my-profile.component';
import { AllNotificationComponent} from './all-notification/all-notification.component';
import { FollowersComponent } from './followers/followers.component';
import {FollowingComponent} from './following/following.component';
import { AllTgsComponent } from './all-tgs/all-tgs.component';
import {TgsDetailsComponent} from './tgs-details/tgs-details.component';
import {GoldpassStatsComponent} from './goldpass-stats/goldpass-stats.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',  component: HomeComponent },
  { path: 'my-home',  component: MyHomeComponent },
  { path: 'settings',  component: SettingsComponent },
  { path: 'edit-profile',  component: EditProfileComponent },
  { path: 'public-profile',  component: PublicProfileComponent },
  { path: 'my-meetings', component: MyMeetingComponent},
  { path: 'testimonials', component: TestimonialsComponent},
  { path: 'search-celebrity' , component: SearchCelebrityComponent},
  { path: 'event-details', component: EventDetailsComponent },
  { path: 'auction-details', component: BidDetailsComponent },
  { path: 'corporate', component: CorporeteLoginComponent },
  { path: 'all-gp-events', component: AllGpEventsComponent},
  { path: 'event-details', component: EventDetailsComponent },
  { path: 'event_hosted', component: EventIHostComponent},
  { path: 'all_auctions', component: AuctionsListComponent},
  { path: 'my_auctions', component: AuctionsListComponent},
  { path: 'auctions_hosted', component: AuctionsListComponent},
  { path: 'user_retail', component: AuctionsListComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'sign-up', component: SignupComponent},
  { path: 'my-profile', component: MyProfileComponent},
  { path: 'notifications', component: AllNotificationComponent},
  { path: 'following', component: FollowersComponent},
  { path: 'my_followers', component: FollowingComponent},
  { path: 'my-following', component: FollowersComponent},
  { path: 'my-followersList', component: FollowingComponent},
  { path: 'all-tgs', component: AllTgsComponent},
  { path: 'my-tgs', component: AllTgsComponent},
  { path: 'tgs-hosted', component: AllTgsComponent},
  { path: 'tgs-details', component: TgsDetailsComponent},
  { path: 'gold-stats', component: GoldpassStatsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
