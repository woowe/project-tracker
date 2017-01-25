import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class UserInfoService {
  _info: FirebaseObjectObservable<any>;
  _login_observable: BehaviorSubject<boolean>;

  auth_val: any;

  _project_manager: FirebaseObjectObservable<any>;
  _dealership: FirebaseObjectObservable<any>;
  _milestones: BehaviorSubject<any>;

  _dealerships: BehaviorSubject<any>;
  _products: BehaviorSubject<any>;
  _users: BehaviorSubject<any>;

  loggedIn: boolean;
  constructor(private af: AngularFire, private router: Router) {
    this._products = new BehaviorSubject(null);
    this._milestones = new BehaviorSubject(null);
    this._login_observable = new BehaviorSubject(null);
    this._dealerships = new BehaviorSubject(null);
  }

  login(email: string, password: string, success: any, error: any) {
    this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
    .then(_success => {
      this.auth_val = _success;
      this._info = this.af.database.object(`/Users/${_success.uid}`);
      this._info.subscribe(info => {

        // project manager logic
        if(info.group === "project manager") {
          var dealerships = [];
          for(let idx in info.dealerships) {
            dealerships.push(this.af.database.object(`/Dealerships/${info.dealerships[idx]}`));
          }
          this._dealerships.next(dealerships);
          dealerships = [];
        }
      });
      success(_success);
      this.loggedIn = true;
      this._login_observable.next(true);
    })
    .catch(_error => {
      error(_error);
      this.loggedIn = false;
      this._login_observable.next(false);
    });
  }

  get auth(): AngularFireAuth {
    return this.af.auth;
  }

  get login_observable(): BehaviorSubject<boolean> {
    return this._login_observable;
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

  get products(): BehaviorSubject<FirebaseObjectObservable<any>[]> {
    console.log('getting products');
    return this._products;
  }

  get milestones(): BehaviorSubject<FirebaseObjectObservable<any>[]> {
    console.log('getting milestones');
    // this._milestones.complete();
    return this._milestones;
  }

  get dealerships(): BehaviorSubject<FirebaseObjectObservable<any>[]> {
    return this._dealerships;
  }

  getAllProductTemplates() {
    return this.af.database.object('/Product Templates/');
  }
  getAllMilestoneTemplates() {
    return this.af.database.object('/Milestone Templates/');
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
    this._products.complete();
    this._milestones.complete();
    this._login_observable.complete();
  }
}
