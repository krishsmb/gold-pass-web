import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpInterceptorService, getHttpHeadersOrInit, getHttpOptions } from 'ng-http-interceptor';
////import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { JwtHelper } from 'angular2-jwt';
//import { LoadingController, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
//import { AppSettings } from '../../settings/app-settings';
//import { AppAlertProvider } from '../../providers/app-alert/app-alert';
//import { LoginPage } from '../../pages/login/login';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

  private headers: any;
  public videoUrl: any;
  public name: any;
  public customHeader: any;
  private jwtHelper = new JwtHelper();
  public loader: any;
  public api_url: any;
  private subject = new Subject<any>();
  constructor(public http: Http, private httpInterceptor: HttpInterceptorService,
    protected storage: AsyncLocalStorage, public HttpClient: HttpClient) {
    this.api_url = environment.apiUrl;
    this.httpInterceptor.request().addInterceptor((data, method) => {
      this.headers = getHttpHeadersOrInit(data, method);
      return data;
    })
    this.httpInterceptor.response().addInterceptor((res, method) => {
      return res;
    })
  }

  //START : general message showing
  updateSetting(set: boolean) {
    this.subject.next({ setting: set });
  }
  clearSetting() {
    this.subject.next();
  }
  doneSetting(): Observable<any> {
    return this.subject.asObservable();
  }


  protected setTokens(headers) {

    if (headers.get('AuthToken'))
      this.storage.setItem('AuthToken', headers.get('AuthToken')).subscribe(() => { }, () => { });

    if (headers.get('RefreshToken'))
      this.storage.setItem('RefreshToken', headers.get('RefreshToken')).subscribe(() => { }, () => { });
  }

  protected getRequestHandler(token, refresh_token, url, params) {
    let headerOptions = {
      'Content-Type': 'application/json',
      'AuthToken': token,
      'RefreshToken': ''
    }

    if (this.jwtHelper.isTokenExpired(token))
      headerOptions.RefreshToken = refresh_token;

    let httpOptions = getHttpOptions([url, { params: params, headers: headerOptions }], 'get');

    return this.http.get(url, httpOptions);
  }


  protected makeGetRequest(url, data, token) {
    return this.storage.getItem('RefreshToken').flatMap(refresh_token => this.getRequestHandler(token, refresh_token, url, data));
  }

  protected postRequestHandler(token, refresh_token, url, data) {

    let header = getHttpHeadersOrInit([url, data], 'post');


    if (refresh_token && token)
      if (this.jwtHelper.isTokenExpired(token))
        header.append('RefreshToken', refresh_token);
    header.append('Content-Type', 'application/json');
    if (token)
      header.append('AuthToken', token);
    return this.http.post(url, data, { headers: header });
  }

  protected makePostRequest(url, data, token) {
    return this.storage.getItem('RefreshToken')
      .flatMap(refresh_token => this.postRequestHandler(token, refresh_token, url, data));
  }

  public _get(url: string, params: any) {
    url = this.api_url + url;
    return this.storage.getItem('AuthToken').flatMap(res =>
      this.makeGetRequest(url, params, res)).map((response) => {
        this.setTokens(response.headers);
        console.log(response.json().statusCode);
        if (response.json().statusCode == 'TokenExpired' || response.json().statusCode == 'TokenInvalid') {
          this.storage.clear().subscribe(() => { }, () => { });
          // console.log('herreeee');
          //this.alert.showAlert("Session Expired."); 
          //this.alert.hideLoading();
          //this.events.publish('Expired:sessionExpired',true);
          // this.navCtrl.setRoot(LoginPage);           
        }
        return response.json();
      }
      );
  }

  public _post(url: string, data: any): Observable<any> {
    let requestUrl = this.api_url + url;
    // console.log('Data', requestUrl, data);
    return this.storage.getItem('AuthToken').flatMap(res =>
      this.makePostRequest(requestUrl, data, res)).map((response) => {
        // console.log('Result', response);
        this.setTokens(response.headers);
        // console.log(response.json().statusCode);    
        if (response.json().statusCode == 'TokenExpired' || response.json().statusCode == 'TokenInvalid') {
          this.storage.clear().subscribe(() => { }, () => { });
          //this.alert.showAlert("Session Expired.");  
          // this.events.publish('Expired:sessionExpired',true);
          //  this.navCtrl.setRoot(LoginPage);           
        }
        return response.json();
      }
      );
  }

  // public showLoader(){
  //   this.loader = this.loadingCtrl.create({
  //   });

  //   this.loader.present();
  //   return this.loader;
  // }

  public hideLoader() {
    // console.log('loader');
    this.loader.dismiss();
  }
  public getAccessToken(callback) {
    var token = '';
    this.storage.getItem('AuthToken').subscribe((token) => {
      callback(token);
    }, (err) => {
      callback(token);
    })

  }

  public _uploadFileToUrl(files, restObj, uploadUrl): Promise<any> {
    const options = {} as any; // Set any options you like
    const formData = new FormData();
    for(var i=0;i<files.length;i++){
      formData.append("images", files[i],files[i].name);
      
      console.log('Formdata format',files[i],'File name : ',files[i].name);
    }
   console.log(formData);

    Object.keys(restObj).forEach(key => {
      formData.append(key, restObj[key]);
      console.log("Key : ",key, "Value : ",restObj[key]);
    });
    return new Promise((resolve, reject) => {
      let requestUrl = this.api_url + uploadUrl;
      let token = '';
      this.getAccessToken((token) => {
        let httpHeaders = new HttpHeaders()
          .set('AuthToken', token);
        let options = {
          headers: httpHeaders
        };

        this.HttpClient.post(requestUrl, formData, { headers: options.headers, observe: 'response' }, )
          .subscribe((response: any) => {

            if (response.headers.get('AuthToken')) {

              this.setTokens(response.headers);
            }
            
              resolve(response.body);
         
          }
          );
      })
    });
  }

  setHeader() {
    var token = '', RefreshToken = '';
    this.storage.getItem('AuthToken').subscribe((res1) => {
      token = res1;

    }, (err) => {

    })
    this.storage.getItem('RefreshToken').subscribe((res) => {
      this.customHeader =
        {
          'AuthToken': token,
          'RefreshToken': res
        }
    }, (err) => {

    })
  }

  setCustomHeader() {
    if (!this.jwtHelper.isTokenExpired(this.customHeader.AuthToken))
      this.customHeader.RefreshToken = '';

    return this.customHeader;
  }

  // uploadVideo (videoUrl,name,videoFrom){
  //   var url ='';
  //   if(videoFrom == 'direct')
  //      url = '/uploaders/uploadVideo';
  //   else if(videoFrom == 'gallery')
  //      url = '/uploaders/fromGallery';
  //   else if(videoFrom == 'respondChallenge')
  //      url = '/uploaders/asResponse';
  //   else if(videoFrom == 'recordDirect')
  //      url = '/uploaders/asDirectUpload';
  //   else if(videoFrom == 'selectFromGallery')
  //      url = '/uploaders/asGalleryUpload';
  //   // console.log('hereeeee');
  //   this.setHeader();
  //   let requestUrl = AppSettings.API_ENDPOINT + url;
  //   let options: FileUploadOptions = {
  //         fileKey: 'video_url',
  //         fileName: name,
  //         params: {'decription':'test','function_name':'uploadVideoDesc'},
  //         headers: this.setCustomHeader()
  //   }

  //   // console.log('optionsss',options);
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   return fileTransfer.upload(videoUrl, requestUrl, options);

  // }
  // uploadAudio (audioUrl,name,videoFrom){
  //   var url ='';
  //   if(videoFrom == 'direct')
  //      url = '/uploaders/audioDirect';
  //   else if(videoFrom == 'gallery')
  //      url = '/uploaders/audiofromGallery';

  //   // console.log('hereeeee');
  //   this.setHeader();
  //   let requestUrl = AppSettings.API_ENDPOINT + url;
  //   let options: FileUploadOptions = {
  //         fileKey: 'audio_url',
  //         fileName: name,
  //         headers: this.setCustomHeader()
  //   }

  //   //console.log('optionsss',options);
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   return fileTransfer.upload(audioUrl, requestUrl, options);
  // }

  isLoggedIn() {
    let user_id = localStorage.getItem("user_id");
    console.log("isLoggedIn", user_id);
    try {
      if (typeof user_id != 'undefined' && user_id) {
        return user_id;
      }
    }
    catch (er) {
      return false;
    }
  }
}