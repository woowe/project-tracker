import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import {Observable} from "rxjs/Rx";

@Injectable()
export class UserInfoService {
  _info: FirebaseObjectObservable<any>;
  // _info_data: any;
  _project_manager: FirebaseObjectObservable<any>;
  loggedIn: boolean;
  constructor(private af: AngularFire, private router: Router) {
    // this.af.auth.subscribe(auth => {
    //   console.log(auth);
      // if(auth !== null) {
      //   this.loggedIn = true;
      // }
    // });

  }

  login(email: string, password: string, success: any, error: any) {
    this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
    .then(_success => {
      // console.log(_success);
      this.loggedIn = true;
      this._info = this.af.database.object(`/Users/${_success.uid}`);
      this._info.subscribe(info => {
        // this._info_data = info;
        if(info.project_manager) {
          this._project_manager = this.af.database.object(`/Users/${info.project_manager}`);
        }
      });
      // this._info.subscribe((info) => {
      //   console.log(info);
      // });
      success(_success);
    })
    .catch(_error => {
      this.loggedIn = false;
      error(_error);
    });
  }

  get auth(): AngularFireAuth {
    return this.af.auth;
  }

  get logged_in() {
    return this.loggedIn;
  }

  get info(): FirebaseObjectObservable<any> {
    return this._info;
  }

  get project_manager(): FirebaseObjectObservable<any> {
    return this._project_manager;
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
  }
}
