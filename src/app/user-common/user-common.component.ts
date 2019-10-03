import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ValidationService } from '../services/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Broadcaster } from '../services/app.broadCaster';
// import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
declare var $: any;
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';
// import { exists } from 'fs';
@Component({
  selector: 'app-user-common',
  templateUrl: './user-common.component.html',
  styleUrls: ['./user-common.component.css']
})
export class UserCommonComponent implements OnInit {
  public admin_verified_message_status: any;
  eventForm: any;
  meetingForm: any;
  tgsForm: any;
  paymentForm: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public price_error: boolean;
  public date: any;
  public user_id: number;
  public meeting: any = {};
  public notification_message: string;
  public bid_image: string;
  public user: any = {};
  public min_auction_validity: number;
  public max_auction_validity: number;
  public min_tgs_duration: number = 1;
  public max_tgs_duration: number = 45;
  public max_draw_event_day_difference: number;
  public min_draw_event_day_difference: number;
  public max_event_duration: number;
  public min_event_duration: number;
  public min_open_event_validity: number;
  public max_open_event_validity: number;
  public meeting_days: any;
  cardDetails: any;
  public cardList: any = [];
  public currentEvent: any;
  public noCard: boolean;
  public showLoader: boolean;
  public dateError = '';
  public tokenDetails: any = {};
  public exp_month: number;
  public exp_year: number;
  public cardError = '';
  public cardSuccess = false;
  public error_message: string;
  public venueList: any = [];
  public venue_error: string;
  public selectedFlag = false;
  public selectedFlagTgs = false;
  public showAmout = false;
  public bidList: any = [];
  public cropperReady = false;
  public locations: number = 0;
  public placeBidSec = false;
  // public error_message: string;
  public curBidAmount: any;
  public showDrawDate = false;
  public raffle_enabled: string;
  public auction_enabled = false;
  public mask = [/[1-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public mask = 
  //public exp_date_mask = [/[0-1]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public exp_date_mask = [/[0-1]/, /\d/, '/', '2', '0', /[0-9]/, /[0-9]/];
  public cvc_mask = [/[1-9]/, /\d/, /\d/];
  public account_no_mask = [/[0-9]/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public routing_no_mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public ssn_no_mask = [/[0-9]/, /\d/, /\d/, /\d/];
  public zip_mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/];
  public dob_mask = [/[0-9]/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public bid: any = {};
  public urls: any= [];
  public base64Images: any= [];
  public packagechk = [
    {
      id: 'package_black',
      value: false,
      label: 'Black Package',
      short_id: 'B'
    },
    {
      id: 'package_silver',
      value: false,
      label: 'Silver Package',
      short_id: 'S'
    },
    {
      id: 'package_gold',
      value: false,
      label: 'Gold Package',
      short_id: 'G'
    }
  ];


  constructor(public apiService: ApiService, private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, public broadcaster: Broadcaster) {

    
    //this.bidList = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440, 460, 480];
    // console.log(this.bidList);
    this.noCard = false;
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '942849159848-g3bgnt7o3ov9gos0361sod18ftrptc77.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyDPlBBDtWdpAVqCRe4gQyEBCrfYHKvIF_0';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    this.showLoader = false;
    this.user = JSON.parse(localStorage.getItem("loggedIn"));
    //this.admin_verified_message_status = localStorage.getItem("admin_verified_message_status");
    console.log(this.user, 'admin_verified');
    this.eventForm = this.formBuilder.group({
      //'title': ['', Validators.required],
      'description': ['', Validators.required],
      'date': [{
        value: '',
        disabled: !this.auction_enabled,
      }, Validators.required],
      'time': [{
        value: '',
        disabled: !this.auction_enabled,
      }, Validators.required],
      'min_price': [{
        value: '',
        disabled: !this.auction_enabled,
      }, [Validators.required, ValidationService.priceValidator, ValidationService.MinpriceValidator]],
      // 'instant_sale_price': ['', [ValidationService.priceValidator,ValidationService.InstantpriceValidator]],
      'instant_sale_price': ['', [ValidationService.priceValidator, ValidationService.InstantpriceValidator]],
      'auctionCheck': [false]

    });

    this.meetingForm = this.formBuilder.group({
      //'title': ['', Validators.required],
      'description': ['', Validators.required],
      'date': ['', Validators.required],
      'time': ['', Validators.required],
      'venue': ['', Validators.required],
      'duration': ['', Validators.required],
      'ticket_price': ['', [Validators.required, ValidationService.priceValidator]],
      'raffleCheck': [false],
      'draw_date': [{
        value: '',
        disabled: !this.showDrawDate,
      }, Validators.required]
    });

    this.tgsForm = this.formBuilder.group({
      // 'title': ['', Validators.required],
      'tgs_description': ['', Validators.required],
      'tgs_date': ['', Validators.required],
      'tgs_time': ['', Validators.required],
      'tgs_venue': ['', Validators.required],
      'tgs_duration': ['', Validators.required],
      'package_black': [false],
      'package_silver': [false],
      'package_gold': [false],
      'gift_message': ['']
    });
    this.cardDetails = this.formBuilder.group({
      'card_num': ['', [Validators.required, ValidationService.creditCardValidator]],
      'name': ['', [Validators.required]],
      'exp_date': ['', [Validators.required]],
      'cvc': ['', [Validators.required]]
    });

    this.paymentForm = this.formBuilder.group({
      'account_number': ['', Validators.required],
      'routing_number': ['', Validators.required],
      'first_name': ['', Validators.required],
      'ssn_number': ['', Validators.required],
      'dob': ['', Validators.required],
      'address': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'zip': ['', Validators.required],
    });


    this.broadcaster.on<string>('formClear')
    .subscribe(message => {
      this.meetingForm.controls['venue'].setValue("");
      $('#venue').material_select();
      this.tgsForm.controls['tgs_venue'].setValue("");
      $('#tgs_venue').material_select();
    });


  }

  // Venue
  getLocation() {
    this.apiService._post('get_locations', { search_key: '' })
      .subscribe(result => {
        if (result['status'] === true) {
          this.venueList = result.locations;
          setTimeout(function(){
            $('select').material_select();          
          },500);
          $('#venue').on('change', (e) => {
            // mytemp = e.currentTarget.selectedOptions[0].value;
            // console.log('hereee',mytemp);
            this.meetingForm.controls['venue'].setValue(e.currentTarget.selectedOptions[0].value);
            console.log('hereee', this.meetingForm.value.venue);
            this.selectedFlag = true;
          });

          $('#tgs_venue').on('change', (e) => {
            // mytemp = e.currentTarget.selectedOptions[0].value;
            // console.log('hereee',mytemp);
            this.tgsForm.controls['tgs_venue'].setValue(e.currentTarget.selectedOptions[0].value);
            console.log('hereee', this.tgsForm.value.tgs_venue);
            this.selectedFlagTgs = true;
          });

          
          // var elems = document.getElementById('kd');
          // var instances = M.FormSelect.init(elems, this.venueList);
          
            // for(let i = 0; i < this.venueList.length; i++){
            //   var opt = $('<option>').attr("value",this.venueList[i].location).text(this.venueList[i].location);
            //   $('#venue').append(opt);
            //   console.log("ttttttttttt", opt);
            // }
        } else {
          this.venue_error = 'No Result Found';
          this.locations = 0;
        }
        console.log('Locations', this.venueList);
      });
  }

  fileChangeEvent(event: any): void {
    //console.log(event,'image event');
    // this.urls = [];
    this.imageChangedEvent = event;
    // console.log("Fileeeee",event);
    //this.urls.push(event.target.files[0]);
    this.openBidImageUploader();
    // if (event.target.files && event.target.files[0]) {
    //   var filesAmount = event.target.files.length;
    //   //this.urls.push(event.target.files)
    //   this.urls = [];
    //   console.log(filesAmount, "Count");
    //   for (let i = 0; i < filesAmount; i++) {
    //     var reader = new FileReader();
    //     reader.onload = (event: any) => {
    //       this.urls.push(event.target.result);
    //       // this.imageChangedEvent = event;
    //       // this.openBidImageUploader();
    //     }
    //     reader.readAsDataURL(event.target.files[i]);
    //     console.log(event,'image events');

    //   }
    //   console.log(this.urls, "Image urls");
    // }
  }
  removeImage(item) {
    let index = this.urls.indexOf(item);
    this.urls.splice(index, 1);
    this.base64Images.splice(index,1);
    console.log(this.urls);
  }


  //Convert base64 to image using pure JavaScript
  b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
// Another function for base64 to image
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(image: File) {
    //console.log('Before File',image);
    this.croppedImage = image;``
    // let filename = Math.floor((Math.random() * 1000) + 1);
    // let myFile = this.dataURLtoFile(this.croppedImage,filename+'.png');
    // console.log("File Details",myFile);    
  }
  imageLoaded() {
    // show cropper
    this.cropperReady = true;
  }
  loadImageFailed() {
    // show message
  }

  openBidImageUploader() {
    let div = $("#modalBidPicture");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }
  closeBidPictureModal() {
    let div = $("#modalBidPicture");
    if (!div.length) return;
    //div.modal({});
    div.modal("close");
  }

  saveBidPictureModal() {
    let filename = Math.floor((Math.random() * 1000) + 1);
    let myFile = this.dataURLtoFile(this.croppedImage,filename+'.png');
    console.log('afterCropping',myFile);
    console.log('afterCropping',this.croppedImage);
    // let ImageURL = this.croppedImage;
    // var block = ImageURL.split(";");
    // var contentType = block[0].split(":")[1];
    // var realData = block[1].split(",")[1];
    // var blob = this.b64toBlob(realData, contentType);
    //this.urls.push(blob);
    this.urls.push(myFile);
    this.base64Images.push(this.croppedImage);
    let div = $("#modalBidPicture");
    if (!div.length) return;
    div.modal("close");
  }


  ngOnInit() {
   
    // Admin verification message popup
    // if (localStorage.getItem("admin_verified_message_status") == 'N') {
    //   this.notification_message = "The account is under admin verification !";
    //   this.openModalNotification();
    //   localStorage.setItem("admin_verified_message_status", "Y");
    // }

    console.log('package_black : ', this.tgsForm.value.package_black);
    console.log('package_silver : ', this.tgsForm.value.package_silver);
    console.log('package_gold : ', this.tgsForm.value.package_gold);


    this.user_id = parseInt(localStorage.getItem("user_id"));
    this.meeting.title = "";
    this.userDetails();
    this.getCardList();
    this.getLocation();

    

    // setup listener for custom event to re-initialize on change
    // $('select').on('contentChanged', function(eve) {
    //   $(this).material_select();
    //   this.meetingForm.controls['venue'].setValue(eve.value);
    // });

    

    setTimeout(function () {
      //console.log( typeof $.autocomplete );
    }, 10000);

    setTimeout(() => {
      $('.collapsible').collapsible();
      $('.dropdown-trigger_bid').dropdown();
 
      // $( "#autocomplete").autocomplete({
      //   source: [ "c++", "java", "php", "coldfusion", "javascript", "asp", "ruby" ]
      // });

      var single = $('#singleInput').materialize_autocomplete({

        multiple: {
          enable: false,
        },
        dropdown: {
          el: '#singleDropdown',
          itemTemplate: '<li class="ac-item" data-id="<%= item.location %>" data-text=\'<%= item.location %>\'><a href="javascript:void(0)"><%= item.location %></a></li>'
        },

        getData: (value, callback) => {
          this.apiService._post('get_locations', { search_key: '' })
            .subscribe(result => {

              if (result['status'] === true) {
                if (result.locations.length) {
                  callback(value, result.locations);
                  this.venue_error = "";
                  this.locations = 1;
                } else {
                  this.venue_error = "No Result Found";
                  this.locations = 0;
                }


              } else {
                this.venue_error = "No Result Found";
                this.locations = 0;

              }
            });
        },
        onSelect: (item) => {
          console.log(item.text + ' was selected');

          this.meetingForm.controls['venue'].setValue(item.text);

          this.selectedFlag = true;
          this.venue_error = "";
          // console.log('testtttttttt',this.eventForm.value.venue);
        }
      });
    }, 500);
    this.getClock();
    this.getMeetingTimeClock();
    this.getTgsTimeClock();

    setTimeout(() => {
      $('.collapsible').collapsible();
      $('.dropdown-trigger_bid').dropdown();
      var single1 = $('#singleInputTgs').materialize_autocomplete({
        multiple: {
          enable: false,
        },
        dropdown: {
          el: '#singleDropdownTgs',
          itemTemplate: '<li class="ac-item" data-id="<%= item.location %>" data-text=\'<%= item.location %>\'><a href="javascript:void(0)"><%= item.location %></a></li>'
        },
        getData: (value, callback) => {
          this.apiService._post('get_locations', { search_key: '' })
            .subscribe(result => {
  
              if (result['status'] === true) {
                if (result.locations.length) {
                  callback(value, result.locations);
                  this.venue_error = "";
                  this.locations = 1;
                } else {
                  this.venue_error = "No Result Found";
                  this.locations = 0;
                }
  
  
              } else {
                this.venue_error = "No Result Found";
                this.locations = 0;
  
              }
            });
        },
        onSelect: (item) => {
          console.log(item.text + ' was selected');
  
          this.tgsForm.controls['tgs_venue'].setValue(item.text);
  
          this.selectedFlagTgs = true;
          this.venue_error = "";
          // console.log('testtttttttt',this.eventForm.value.venue);
        }
      });
    }, 500);

  }



  autoCompleteCallback1(selectedData: any) {
    //do any necessery stuff.
    console.log(selectedData);
  }

  getCalender() {
    // window.scrollTo(0,0);
    // $("modal2").scrollTop();

    $('#date').pickadate({
      format: 'mm/dd/yyyy',
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false, // Close upon selecting a date,      
      min: +this.min_auction_validity,// An integer (positive/negative) sets it relative to today.      
      max: +this.max_auction_validity  // `true` sets it to today. `false` removes any limits.
    });


    var self = this;
    $("#date").on("change", function () {
      let selected = $(this).val();
      self.updatebidDate(selected);
    });

    $("#modal1").scrollTop(0, 0); 
  }

  changeSelectText(){
    // console.log("Focus");
    // this.meetingForm.controls['venue'].setValue('');
    // this.meetingForm.controls['venue'].setValue('co');
    // this.meetingForm.controls['venue'].setValue('');
    
    // var e = $.Event('change');
    // e.which = 253;
    // console.log("Event", e);
    var character = "e";
    $('#singleInput').trigger({
      type: 'keydown',
      which: character.charCodeAt(0 /*the key to trigger*/)      
     });
  }

  selectVenueChanged(event){
    console.log("New event", event);
  }


  updatebidDate(date) {
    this.eventForm.controls['date'].setValue(date);
  }

  testClick($eve) {
    if (this.eventForm.value.amountCheck)
      this.showAmout = false;
    else
      this.showAmout = true;
  }

  getClock() {
    //window.scrollTo(0,0);
    $('#bid_time').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: true, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function () { } //Function for after opening timepicker
    });
    var self = this;
    $("#bid_time").on("change", function () {
      var selected = $(this).val();
      self.updatebidTime(selected);
    });

    $("#modal1").scrollTop(0, 0);
  }
  updatebidTime(time) {
    this.eventForm.controls['time'].setValue(time);
  }
  closeModalEvent() {
    //this.urls = [];
    this.bid_image = "";
    this.croppedImage = "";

    let div = $("#modal1");
    if (!div.length) return;
    // console.log(div,'div');
    div.modal({});
    div.modal("close");
    this.urls = [];
    this.base64Images = [];

    setTimeout(() => {
      this.eventForm.reset();
    }, 1000);

  }
  closeModalMeeting() {
    let div = $("#modal2");
    if (!div.length) return;
    // div.modal({});
    div.modal("close");
    setTimeout(() => {
      this.meetingForm.reset();
    }, 1000);


  }

  closeModalTgs() {
    let div = $("#modal3");
    if (!div.length) return;
    div.modal("close");
    setTimeout(() => {
      this.tgsForm.reset();
    }, 1000);
  }
  someFun($ev){
    console.log($ev,'1233333');
  }

  // podt bid
  postEvent() {
    
    //this.spinnerService.show()
    if (this.eventForm.value.amountCheck && !this.eventForm.value.instant_sale_price) {
      this.error_message = "Amount cannot be blank";
    } else if (this.eventForm.dirty && this.eventForm.valid) {
      this.error_message = '';
      let data = {
        description: this.eventForm.value.description,
        date: this.eventForm.value.date,
        time: this.eventForm.value.time,
        min_price: this.eventForm.value.min_price,
        instant_sale_price: this.eventForm.value.instant_sale_price,
        // image64: this.bid_image,
        // images: this.urls,
        auction: this.eventForm.value.auctionCheck,
        user_id: this.user_id
      };
      //let fileBrowser = this.eventForm.file;
      // var data = new FormData();
      // data.append('description',this.eventForm.value.description);
      // data.append('date',this.eventForm.value.description);
      // data.append('time',this.eventForm.value.time);
      // data.append('min_price',this.eventForm.value.min_price);
      // data.append('instant_sale_price',this.eventForm.value.instant_sale_price);
      // for(let i = 0; i < this.urls.length; i++){
      //   //let filename = Math.floor((Math.random() * 1000) + 1);
      //   data.append('images[]',this.urls[i]);
      // }
      // //data.append('images',this.urls);
      // data.append('auction',this.eventForm.value.auctionCheck);
      // data.append('user_id',this.user_id.toString());
      console.log('data1234',data);
      

      this.apiService._uploadFileToUrl(this.urls, data,'post_bid')
        .then(result => {
          console.log("Yeeeeeeeee");
          this.spinnerService.hide()
          if (result['status'] === true) {
            console.log("Hi");
            this.closeModalEvent();
            this.notification_message = result['message'];
            this.openModalNotification();
            this.broadcaster.broadcast('forFeedRefreshing', 'success');
          } else {
            console.log("Helooo");
            this.error_message = result['message'];
            this.user.password = "";
          }
        });
    }
  }

  postMeeting() {
    //this.venue_error = "";
    if (!this.selectedFlag) {
      this.venue_error = "Please Select a venue";
      this.meetingForm.value.venue = "";
    } else if (!this.user.consumer_stripe_account) {
      this.notification_message = "Please Enroll Card Details";
      this.openModalNotification();
    } else if (this.meetingForm.dirty && this.meetingForm.valid) {
      let data = {
        description: this.meetingForm.value.description,
        date: this.meetingForm.value.date,
        time: this.meetingForm.value.time,
        venue: this.meetingForm.value.venue,
        duration: this.meetingForm.value.duration,
          ticket_price: this.meetingForm.value.ticket_price,
          draw_date: this.meetingForm.value.draw_date,
          raffle: this.meetingForm.value.raffleCheck,
          user_id: this.user_id
      };
      this.apiService._post('post_meeting', data).subscribe(result => {
        if (result['status'] === true) {
          this.closeModalMeeting();
          this.notification_message = result['message'];
          this.openModalNotification();
          this.broadcaster.broadcast('forFeedRefreshing', 'success');

        } else {
          this.notification_message = result['message'];
          this.openModalNotification();
        }
      });
    }
  }


  postTgs() {
    //this.venue_error = "";
    if (!this.selectedFlagTgs) {
      this.venue_error = "Please Select a venue";
      this.tgsForm.value.tgs_venue = "";
    } else if (!this.user.consumer_stripe_account) {
      this.notification_message = "Please Enroll Card Details";
      this.openModalNotification();
    } else if (this.packagechk[2].value === true && this.tgsForm.value.gift_message === '') {
      this.notification_message = 'Please add a gift message.';
      this.openModalNotification();
    } else if(this.packagechk[0].value === false && this.packagechk[1].value === false && this.packagechk[2].value === false) {
      this.notification_message = 'Please select atleast one package.';
      this.openModalNotification();
    } else if (this.tgsForm.dirty && this.tgsForm.valid) {
      const available_prices = [];
      this.packagechk.forEach(element => {
        if (element.value === true) {
          available_prices.push(element.short_id);
        }
      });
      let data = {
        description: this.tgsForm.value.tgs_description,
        date: this.tgsForm.value.tgs_date,
        time: this.tgsForm.value.tgs_time,
        venue: this.tgsForm.value.tgs_venue,
        duration: this.tgsForm.value.tgs_duration,
        user_id: this.user_id,
        available_prices: available_prices.toString(),
        gift_message: this.tgsForm.value.gift_message
      };
      // console.log("Tgs Form", data);
      this.apiService._post('post_tgs', data).subscribe(result => {
        console.log("Tgs after post", result);
        if (result['status'] === true) {
          this.closeModalTgs();
          this.notification_message = result['message'];
          this.openModalNotification();
          this.broadcaster.broadcast('forFeedRefreshing', 'success');
        } else {
          this.notification_message = result['message'];
          this.openModalNotification();
        }
      });
    }
  }

  // changeVenue($eve) {
  //   console.log("Value", $eve);
  //   this.meetingForm.controls['venue'].setValue($eve);
  //   // console.log('hereeeeeeeeeee',this.selectedFlag);
  //   const refcntrl = this.meetingForm.get('venue');
  //   // if (this.selectedFlag) {
  //   //   this.meetingForm.value.venue = '';
  //   //   refcntrl.setValue('');
  //   // }
  // }

  // changeVenueTgs($eve) {
  //   // console.log('selectedFlagTgs',this.selectedFlagTgs);
  //   const refcntrl = this.tgsForm.get('tgs_venue');
  //   if (this.selectedFlagTgs) {
  //     this.tgsForm.value.tgs_venue = '';
  //     refcntrl.setValue('');
  //   }
  // }
  getDrwDateCalender() {
    var min_date = this.meeting_days - this.max_draw_event_day_difference;
    var max_date = this.meeting_days - this.min_draw_event_day_difference;
    $('#draw_date').pickadate({
      format: 'mm/dd/yyyy',
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false, // Close upon selecting a date,
      min: +min_date,// An integer (positive/negative) sets it relative to today.      
      max: +max_date
      // `true` sets it to today. `false` removes any limits.
    });

    var self = this;
    $("#draw_date").on("change", function () {
      let selected = $(this).val();
      self.updateDrawDate(selected);
    });
    $("#modal1").scrollTop(0, 0);
  }

  updateDrawDate(date) {
    // console.log(date);
    //this.meetingForm.controls['draw_date'].setValue('20/02/2017');
    this.meetingForm.controls['draw_date'].setValue(date);
  }

  getMeetingDateCalender() {
    $('#meeting_date').pickadate({
      format: 'mm/dd/yyyy',
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false, // Close upon selecting a date,
      min: +this.min_open_event_validity,// An integer (positive/negative) sets it relative to today.      
      max: +this.max_open_event_validity  // `true` sets it to today. `false` removes any limits.
    });

    var self = this;
    $("#meeting_date").on("change", function () {
      let selected = $(this).val();
      self.updateMeetingDate(selected);
    });

  }

  updateMeetingDate(date) {
    this.meetingForm.controls['date'].setValue(date);

    var date2 = new Date();
    var date1 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.meeting_days = dayDifference;


    //var startDate=moment().format('DD.MM.YYYY');
    //var endDate = moment(date, 'DD MMMM, YYYY').format('DD.MM.YYYY');    
    //var given = moment(date, "YYYY-MM-DD");
    //var current = moment().format('YYYY-MM-DD');

    //Difference in number of days
    // var no_days= moment.duration(current.diff(given)).asDays();
    console.log(dayDifference);
  }

  getMeetingTimeClock() {
    $('#meeting_time').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: true, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function () { } //Function for after opening timepicker
    });

    var self = this;
    $("#meeting_time").on("change", function () {
      var selected = $(this).val();
      self.updateMeetingTime(selected);
    });
  }
  updateMeetingTime(time) {
    this.meetingForm.controls['time'].setValue(time);
  }


  getTgsDateCalender() {
    console.log('min_tgs_duration', this.min_tgs_duration, "ggg", this.max_tgs_duration);
    $('#tgs_date').pickadate({
      format: 'mm/dd/yyyy',
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year,
      today: 'Today',
      clear: 'Clear',
      close: 'Ok',
      closeOnSelect: false, // Close upon selecting a date,
      min: +this.min_tgs_duration,// An integer (positive/negative) sets it relative to today.      
      max: +this.max_tgs_duration  // `true` sets it to today. `false` removes any limits.
    });

    var self = this;
    $("#tgs_date").on("change", function () {
      let selected = $(this).val();
      self.updateTgsDate(selected);
    });

  }

  updateTgsDate(date) {
    this.tgsForm.controls['tgs_date'].setValue(date);

    // var date2 = new Date();
    // var date1 = new Date(date);
    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    // var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // this.meeting_days = dayDifference;


    //var startDate=moment().format('DD.MM.YYYY');
    //var endDate = moment(date, 'DD MMMM, YYYY').format('DD.MM.YYYY');    
    //var given = moment(date, "YYYY-MM-DD");
    //var current = moment().format('YYYY-MM-DD');

    //Difference in number of days
    // var no_days= moment.duration(current.diff(given)).asDays();
    // console.log(dayDifference);
  }

  getTgsTimeClock() {
    $('#tgs_time').pickatime({
      default: 'now', // Set default time: 'now', '1:30AM', '16:30'
      fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
      twelvehour: true, // Use AM/PM or 24-hour format
      donetext: 'OK', // text for done-button
      cleartext: 'Clear', // text for clear-button
      canceltext: 'Cancel', // Text for cancel-button
      autoclose: false, // automatic close timepicker
      ampmclickable: true, // make AM PM clickable
      aftershow: function () { } //Function for after opening timepicker
    });

    var self = this;
    $("#tgs_time").on("change", function () {
      var selected = $(this).val();
      self.updateTgsTime(selected);
    });
  }
  updateTgsTime(time) {
    this.tgsForm.controls['tgs_time'].setValue(time);
  }


  closeNotification() {
    let div = $('#modalNotification');
    if (!div.length) return;
    // div.modal({});
    div.modal('close');
    this.eventForm.reset();
    this.meetingForm.reset();
    this.tgsForm.reset();
  }
  openModalNotification() {
    let div = $('#modalNotification');
    if (!div.length) return;
    div.modal({});
    div.modal("open");

  }

  // Confirmation modal
  openConfirmationModal() {
    console.log("opened");
    let div = $("#confirmation_modal");
    if (!div.length) return;
    div.modal({});
    div.modal("open");

  }
  closeConfirmation() {
    let div = $("#confirmation_modal");
    if (!div.length) return;
    // div.modal({});
    div.modal("close");


  }



  userDetails() {
    this.user_id = parseInt(localStorage.getItem("user_id"));

    let data = { user_id: this.user_id };
    this.apiService._post('user_details', data)
      .subscribe(result => {
        if (result['status'] === true) {
          this.user = result['data'];
          this.raffle_enabled = this.user.raffle;
          if (this.raffle_enabled == 'Y') {
            this.showDrawDate = false;
          } else {
            this.showDrawDate = true;
          }
          this.min_auction_validity = result['min_auction_validity'];
          this.max_auction_validity = result['max_auction_validity'];
          this.min_open_event_validity = result['min_open_event_validity'];
          this.max_open_event_validity = result['max_open_event_validity'];
          this.min_event_duration = result['min_event_duration'];
          this.max_event_duration = result['max_event_duration'];
          this.min_draw_event_day_difference = result['min_draw_event_day_difference'];
          this.max_draw_event_day_difference = result['max_draw_event_day_difference'];
          this.min_tgs_duration = result['min_tgs_duration'];
          this.max_tgs_duration = result['max_tgs_duration'];

        } else {

        }
      });
  }

  /**
* 
*  card popup section starts heree
*/
  checkdate(curDate) {
    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth() + 1;
    // get parts of the expiration date
    var parts = curDate.split('/');
    var year = parseInt(parts[1]);
    var month = parseInt(parts[0]);
    // compare the dates
    if ((year < currentYear || (year == currentYear && month < currentMonth)) || (!curDate.match(/(0[1-9]|1[0-2])[/][0-9]{2}/))) {
      return true;
    } else {
      this.exp_month = month;
      this.exp_year = year;
      return false;
    }
  }


  callApi = function (url, token) {
    this.cardError = '';
    var data = {};
    if (url == 'add_cards') {
      data = {
        user_id: this.user.user_id,
        stripe_token: token
      }
    } else {
      data = {
        user_id: this.user.user_id,
        stripe_token: token
      }
    }

    this.apiService._post(url, data)
      .subscribe(result => {
        if (result.status === true) {
          if (result.status) {
            this.noCard = false;
            this.cardList.push(result.data);
            var mydiv = document.getElementById('collapsible-body');
            mydiv.setAttribute("style", "display: none");
            this.cardSuccess = true;
            setTimeout(function () {
              this.cardSuccess = false;
            }, 500)

          } else {
            this.cardError = result.error.message;
          }
        }
      });

  }


  createToken = function (apiurl) {
    (<any>window).Stripe.card.createToken({
      number: parseInt(this.tokenDetails.cardNumber),
      exp_month: this.tokenDetails.exp_month,
      exp_year: this.tokenDetails.exp_year,
      cvc: parseInt(this.tokenDetails.cvc),
      name: this.tokenDetails.name
    }, (status: number, response: any) => {
      if (status === 200) {
        this.callApi(apiurl, response.id);
      } else {
        console.log(response.error.message);
      }
    });
  }


  creatCard() {
    this.dateError = ''
    var dateValid = this.checkdate(this.cardDetails.value.exp_date);
    if (dateValid) {
      this.dateError = "Invalid Expiry date";
    }
    // else {
    //   this.dateError = '';
    //   this.tokenDetails = {
    //     cardNumber:this.cardDetails.value.card_num.replace(/[ -]/g, ''),
    //     cvc:this.cardDetails.value.cvc,
    //     name:this.cardDetails.value.name,
    //     exp_month:this.exp_month,
    //     exp_year:this.exp_year
    //   }
    //   if(this.user.consumer_stripe_account) {
    //     var token = this.createToken('add_cards');
    //   } else {
    //     var token = this.createToken('create_consumer_stripe_account');
    //   }
    // }

  }


  getCardList() {
    let data = {
      user_id: this.user.user_id
    }
    this.apiService._post('get_cards', data)
      .subscribe(result => {
        if (result.status === true) {
          this.broadcaster.broadcast('getCardSuccess', this.cardList);
          if (result.cards.length) {
            this.noCard = false;
            this.cardList = result.cards;
            //  console.log('hereeesuceess')

          } else {
            this.noCard = true;
          }
        }
      });
  }

  closeBuyTickets() {
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("close");
  }

  // selectMe(card){
  // this.spinnerService.show();

  //   if(card.checked){
  //     let data = {
  //       user_id:this.user.user_id,
  //       meeting_id:this.currentEvent.id,
  //       card_id:card.id
  //     }
  //     this.apiService._post('buy_tickets', data)
  //     .subscribe(result => {
  //         if (result.status === true) {
  //           this.spinnerService.hide();           
  //           this.notification_message = "You have successfully purchased the tickets";
  //           let div  = $("#buyTickets") ;
  //           if(!div.length) return ;
  //           div.modal({});
  //           div.modal("close");


  //           this.openModalNotification();
  //         } else {
  //           this.notification_message = result.error_message;
  //           this.spinnerService.hide();
  //         }
  //     });
  //   }
  // }

  selectMe(card) {
    console.log("this.currentEvent", this.currentEvent);
    if (card.checked) {
      this.spinnerService.show();

      if (card.checked && !(this.currentEvent.hasOwnProperty("bid_status")) && !(this.currentEvent.hasOwnProperty('tgs_status'))) {

        let data = {
          user_id: this.user.user_id,
          meeting_id: this.currentEvent.id,
          card_id: card.id
        }
        this.showLoader = true;
        this.apiService._post('buy_tickets', data)
          .subscribe(result => {
            if (result.status === true) {
              card.checked = false;
              this.showLoader = false;
              this.notification_message = "You have successfully purchased the tickets";
              let div = $("#buyTickets");
              this.spinnerService.hide();
              if (!div.length) return;
              div.modal({});
              div.modal("close");
              this.openModalNotification();
            } else {
              this.notification_message = result.error_message;
              this.spinnerService.hide();
            }
          });
      } else if (card.checked && (this.currentEvent.hasOwnProperty("bid_status")) && !this.placeBidSec) {
        let data = {
          user_id: this.user.user_id,
          bid_id: this.currentEvent.id,
          card_id: card.id
        }
        this.spinnerService.show();
        this.apiService._post('buy_now', data)
          .subscribe(result => {
            if (result.status === true) {
              card.checked = false;
              this.showLoader = false;
              if (this.curBidAmount)
                this.notification_message = "You bought this item for $" + this.curBidAmount;
              else
                this.notification_message = "You bought this item for $" + this.currentEvent.instant_sale_price;
              let div = $("#buyTickets");
              this.spinnerService.hide();
              if (!div.length) return;
              div.modal({});
              div.modal("close");
              this.openModalNotification();
            } else {
              this.notification_message = result.error_message;
              this.spinnerService.hide();
            }
          });
      } else if (card.checked && this.placeBidSec) { //place bid after adding card
        this.spinnerService.show();
        var data = {
          bid_id: this.bid.id,
          user_id: this.user_id,
          bid_price: this.curBidAmount
        }
        this.apiService._post('place_bid', data)
          .subscribe(result => {
            if (result.status === true) {
              card.checked = false;
              this.showLoader = false;
              this.notification_message = "You have successfully Placed The Bid";
              let div = $("#buyTickets");
              this.spinnerService.hide();
              if (!div.length) return;
              // div.modal({});
              div.modal("close");
              this.openModalNotification();
              this.broadcaster.broadcast('bidPlaced', 'success');
              // this.placeBidSuccessfully();
              this.openModalNotification();


            } else {
              this.spinnerService.hide();
              this.notification_message = result.error_message;
            }
          });
      }else if (card.checked && (this.currentEvent.hasOwnProperty('tgs_status'))) {
        let data = {
          tgs_id: this.currentEvent.id,
          card_id: card.id,
          ticket_price : this.currentEvent.ticket_price,
          package_type: this.currentEvent.package_type
        }
        console.log("Data : ", data);
        this.showLoader = true;
        this.apiService._post('buy_tgs_tickets', data)
          .subscribe(result => {
            if (result.status === true) {
              card.checked = false;
              this.showLoader = false;
              this.notification_message = "You have successfully purchased the tickets";
              let div = $("#buyTickets");
              this.spinnerService.hide();
              if (!div.length) return;
              // div.modal({});
              div.modal("close");
              this.openModalNotification();
              this.broadcaster.broadcast('forRefreshing', 'success');
            } else {
              this.notification_message = result.error_message;
              this.spinnerService.hide();
              this.openModalNotification();
            }
          });
      }
    } else {
      console.log('hiiiii');
    }

  }

  /**
  * 
  *  card popup section ends heree
  */

  closeBuyticketsModal() {
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal("close");
  }
  closePaymentNotification() {
    let div = $("#celebrity_payment");
    if (!div.length) return;
    div.modal("close");
  }
  closePaymentNotification1() {
    let div = $("#celebrity_payment1");
    if (!div.length) return;
    div.modal("close");
  }
  createStripeAccount() {
    //console.log(this.paymentForm.value);
    this.spinnerService.show();
    if (this.paymentForm.dirty && this.paymentForm.valid) {
      let data = {
        account_number: this.paymentForm.value.account_number.replace(/[ -]/g, ''),
        routing_number: this.paymentForm.value.routing_number,
        first_name: this.paymentForm.value.first_name,
        ssn_number: this.paymentForm.value.ssn_number.replace(/[ -]/g, ''),
        address: this.paymentForm.value.address,
        city: this.paymentForm.value.city,
        state: this.paymentForm.value.state,
        zip: this.paymentForm.value.zip.replace(/[ -]/g, ''),
        day: this.paymentForm.value.dob.substring(0, 2),
        month: this.paymentForm.value.dob.substring(3, 5),
        year: this.paymentForm.value.dob.substring(6, 10),
        user_id: this.user_id
      };
      //console.log(data);
      this.apiService._post('create_celebrity_stripe_account', data)
        .subscribe(result => {
          console.log(result);
          if (result['status'] === true) {
            this.closeCelebrityPayment();
            this.spinnerService.hide();
            this.doneSetting();
            this.notification_message = "Successfully added Payment Method";
            this.user.consumer_stripe_account = true;
            this.openModalNotification();
          } else {
            this.error_message = result['message'];
            console.log(this.error_message);
            this.spinnerService.hide();
            //this.loading = false;
            // this.user.password = "" ;
          }
        });
    }
  }
  doneSetting(): void {
    // send message to subscribers via observable subject
    this.apiService.updateSetting(true);

  }
  createCelebrityPayment() {
    this.closePaymentNotification();
    let div = $("#celebrity_payment_profile");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }
  createCelebrityPayment1() {
    this.closePaymentNotification1();
    let div = $("#celebrity_payment_profile");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }
  closeCelebrityPayment() {
    let div = $("#celebrity_payment_profile");
    if (!div.length) return;
    div.modal("close");
  }
  // closeCelebrityPayment1(){
  //   let div  = $("#celebrity_payment_profile") ;
  //   if(!div.length) return ;  
  //   div.modal("close");
  // }
  /**
   * bid section starts here
   */

  passValue(val) {
    this.curBidAmount = val;
  }

  openModalForPlaceBid() {
    this.placeBidSec = true;
    this.currentEvent = this.bid;
    let div = $("#buyTickets");
    if (!div.length) return;
    div.modal({});
    div.modal("open");

  }

  placeBid() {
    // if(this.user.consumer_stripe_account && this.cardList.length){
    //   var data ={
    //     bid_id:this.bid.id,
    //     user_id:this.user_id,
    //     bid_price:this.curBidAmount
    //   }
    //   this.apiService._post('place_bid', data)
    //   .subscribe(result => {
    //       if (result.status === true) {
    //         this.showLoader= false;
    //         this.notification_message = "You have successfully Placed The Bid";
    //         let div  = $("#bidModal") ;
    //         if(!div.length) return ;
    //         div.modal({});
    //         div.modal("close");
    //         this.broadcaster.broadcast('bidPlaced', 'success');
    //         // this.placeBidSuccessfully();
    //         this.openModalNotification();


    //       } else {
    //         this.notification_message = result.error_message;
    //       }
    //   });
    // } else {
    let div = $("#bidModal");
    if (!div.length) return;
    div.modal({});
    div.modal("close");
    this.openModalForPlaceBid();
    // }

  }

  buyNow(auctn) {

  }

  openModalForBuyBid() {
    let div = $("#bidModal");
    if (!div.length) return;
    div.modal({});
    div.modal("open");
  }

  closeBuyBid() {
    let div = $("#bidModal");
    if (!div.length) return;
    div.modal("close");
  }

  checkRaffle($eve) {
    //console.log( this.meetingForm.get('raffleCheck') , '123478888888888');
    const refcntrl = this.meetingForm.get('draw_date');
    //console.log(refcntrl,'jjjjjjjjjjjjjjjjj');
    // this.meetingForm.get('raffleCheck');
    if (!this.meetingForm.value.raffleCheck) {
      refcntrl.enable();
    }

    else
      refcntrl.disable();

    // console.log(this.showDrawDate,'dddddddddddddddddddddddddd');
  }

  checkAuction($eve) {
    //console.log( this.eventForm.get('auctionCheck') , '123478888888888');
    const min_price = this.eventForm.get('min_price');
    const date = this.eventForm.get('date');
    const time = this.eventForm.get('time');
    // this.meetingForm.get('raffleCheck');
    if (!this.eventForm.value.auctionCheck) {
      min_price.enable();
      date.enable();
      time.enable();
    }

    else {
      min_price.disable();
      date.disable();
      time.disable();

    }

  }


  creatPayment() {
    this.spinnerService.show();
    this.dateError = ''
    var dateValid = this.checkdate(this.cardDetails.value.exp_date);
    if (dateValid) {
      this.dateError = "Invalid Expiry date";
      this.spinnerService.hide();
    } else {
      this.dateError = '';
      let url = "";
      (<any>window).Stripe.card.createToken({
        number: parseInt(this.cardDetails.value.card_num.replace(/[ -]/g, '')),
        exp_month: this.exp_month,
        exp_year: this.exp_year,
        cvc: parseInt(this.cardDetails.value.cvc),
        name: this.cardDetails.value.name
      }, (status: number, response: any) => {
        console.log('token', response.id);
        if (this.user.consumer_stripe_account === 'No') {
          // var token = this.createToken('add_cards');
          url = 'create_consumer_stripe_account';
        } else {
          // var token = this.createToken('create_consumer_stripe_account');
          url = 'add_cards';
        }
        let data = {};
        data = {
          user_id: this.user.user_id,
          stripe_token: response.id
        };


        this.apiService._post(url, data)
          .subscribe(result => {
            if (result.status === true) {
              this.spinnerService.hide();
              if (result.status) {
                this.noCard = false;
                this.cardList.push(result.data);
                this.user.consumer_stripe_account = true;
                // var mydiv = document.getElementById('collapsible-body');
                // mydiv.setAttribute("style", "display: none");
                $('.collapsible-body').hide();
                this.cardSuccess = true;
                setTimeout(function () {
                  this.cardSuccess = false;
                }, 500);
                this.spinnerService.hide();
              } else {
                this.spinnerService.hide();
                this.cardError = result.error.message;
              }
            }else {
              this.spinnerService.hide();
            }
          });

      });


    }

  }



  /**
   * bid section ends here
   */

  //  venue changes
  doSomething() {

  }

  bidUpdate(eve) {
    this.curBidAmount = $(eve.target).val() || null;
  }

  valuecheck(ev) {
    if (this.eventForm.value.min_price) {
      let data = this.eventForm.value.min_price
      this.eventForm.controls['min_price'].setValue(data);
    }
  }

  onPackageSelect() {
    console.log('package_black : ', this.tgsForm.value.package_black);
    console.log('package_silver : ', this.tgsForm.value.package_silver);
    console.log('package_gold : ', this.tgsForm.value.package_gold);
  }

}
