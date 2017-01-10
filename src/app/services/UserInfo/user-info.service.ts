import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class UserInfoService {
  _info: FirebaseObjectObservable<any>;
  _login_observable: BehaviorSubject<boolean>;

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
      this._info = this.af.database.object(`/Users/${_success.uid}`);
      this._info.subscribe(info => {

        //customer logic
        if(info.group === "customer") {
          this._project_manager = this.af.database.object(`/Users/${info.project_manager}`);
          this._dealership = this.af.database.object(`/Dealerships/${info.dealership}`);
          this._dealership.subscribe(dealership_info => {
            console.log('Found Dealership: ', dealership_info);
            var products: FirebaseObjectObservable<any>[] = Array.apply(null, Array(5)).map(function () {});
            var milestones: FirebaseObjectObservable<any>[] = Array.apply(null, Array(5)).map(function () {});
            var cnt = 0;
            var pl = dealership_info.products.length;
            console.log("NUMBER OF PRODUCTS", pl);
            for(let idx in dealership_info.products) {
              products[idx] = this.af.database.object(`/Product Building/${dealership_info.products[idx]}`);
              products[idx].subscribe(product_info => {
                console.log('Found Product: ', product_info);
                var i = parseInt(product_info.type);
                milestones[i] = this.af.database.object(`/Milestone Building/${product_info.template}`);
                milestones[i].subscribe(milestone_info => {
                  console.log("Found milestone: ", milestone_info);
                });

                if( cnt >= pl - 1 ) {
                  console.log(milestones);
                  this._milestones.next(milestones);
                  // this._milestones.complete();
                  milestones = [];
                  cnt = 0;
                }
              });
              ++cnt;
            }
            console.log(products);
            this._products.next(products);
            // this._products.complete();
            products = [];
          });
        }

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

  getDayDiff(start_ms: number, end_ms: number, days_diff: number) {
    var days_diff_ms = Math.abs(days_diff) * 86400000;
    return (days_diff >= 0) ? start_ms + days_diff_ms : end_ms - days_diff;
  }

  calculateMilestoneCompletion(p_info: any, m_info: any): Observable<number> {
    if(typeof p_info !== "object" || typeof m_info !== "object") {
      return null;
    }
    return Observable.create(observer => {
      // gets milliseconds then divides by 86400000 to convert milliseconds into days.
      var date_now = Date.parse(p_info.started) + (14 * 86400000);
      var activation = Date.parse(p_info.activation);
      var started = Date.parse(p_info.started);
      var total_time = (activation - started) / 86400000 | 0;
      var elapsed_time = (date_now - started) / 86400000 | 0;

      var need_attenion_milestones: Array<string> = [];

      var total_points = 0;
      var acc_points = 0;
      for(let milestone of m_info.milestones) {
        if(this.getDayDiff(started, activation, milestone.days_differential) <= date_now && milestone.status === "Complete") {
          acc_points += milestone.points;
        }
        if(milestone.status === "Needs Attention") {
          need_attenion_milestones.push(milestone.name);
        }
        total_points += milestone.points;
      }
      var percent_complete = acc_points / total_points;
      observer.next( {
        percent_complete: percent_complete * 100,
        status: need_attenion_milestones.length > 0 ? "Needs Attention" : "On Schedule",
        need_attenion_milestones: need_attenion_milestones
      });
      observer.complete();
    });
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
    this._products.complete();
    this._milestones.complete();
    this._login_observable.complete();
  }
}
