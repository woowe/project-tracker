import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject } from "rxjs/Rx";

@Injectable()
export class UserInfoService {
  _info: FirebaseObjectObservable<any>;
  // _info_data: any;
  _project_manager: FirebaseObjectObservable<any>;
  _dealership: FirebaseObjectObservable<any>;
  _products: Subject<any>;
  _milestones: Subject<any>;

  loggedIn: boolean;
  constructor(private af: AngularFire, private router: Router) {
    // this.af.auth.subscribe(auth => {
    //   console.log(auth);
      // if(auth !== null) {
      //   this.loggedIn = true;
      // }
    // });

    this._products = new Subject();
    this._milestones = new Subject();
  }

  login(email: string, password: string, success: any, error: any) {
    this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
    .then(_success => {
      // console.log(_success);
      this.loggedIn = true;
      this._info = this.af.database.object(`/Users/${_success.uid}`);
      this._info.subscribe(info => {

        //customer logic
        if(info.project_manager) {
          this._project_manager = this.af.database.object(`/Users/${info.project_manager}`);
        }
        if(info.dealership) {
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
                  milestones = [];
                  cnt = 0;
                }
              });
              ++cnt;
            }
            console.log(products);
            this._products.next(products);
            products = [];
            // this._products.complete();
            // this._products.subscribe(products => {});
          });
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

  get products(): Subject<FirebaseObjectObservable<any>[]> {
    return this._products;
  }

  get milestones(): Subject<FirebaseObjectObservable<any>[]> {
    return this._milestones;
  }

  ngOnDestroy() {
    this.af.auth.unsubscribe();
    this._products.complete();
  }
}
