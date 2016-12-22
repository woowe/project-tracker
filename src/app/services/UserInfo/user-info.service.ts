import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth } from 'angularfire2';
import { Router } from '@angular/router';

import {Observable} from "rxjs/Rx";

@Injectable()
export class UserInfoService {
  loggedIn: boolean;
  constructor(private af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if(auth !== null) {
        this.loggedIn = true;
      }
    });
  }

  login(email: string, password: string, success: any, error: any) {
    this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
    .then(_success => {
      this.loggedIn = true;
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

  ngOnDestroy() {
    this.af.auth.unsubscribe();
  }
}
