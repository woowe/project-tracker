import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class ProjectManagerService {
  _info: FirebaseObjectObservable<any>;

  _project_manager: FirebaseObjectObservable<any>;
  _dealership: FirebaseObjectObservable<any>;
  _milestones: BehaviorSubject<any>;

  _dealerships: Observable<any>;
  _products: BehaviorSubject<any>;
  _users: Observable<any>;

  loggedIn: boolean;
  constructor(private af: AngularFire, private router: Router) {
    this._products = new BehaviorSubject(null);
    this._milestones = new BehaviorSubject(null);
    this._dealerships = Observable.empty();
    this._users = Observable.empty();
  }

  getProjectManagerInfo(auth): Observable<any> {
    return Observable.create(observer => {

      Observable.from(this.af.database.object(`/Users/${auth.uid}`))
        .filter(info => info.group == "project manager")
        .do(info => {
          this._info = info;
        })
        .subscribe(info => {
          this._dealerships = Observable.from(info.dealerships)
            .mergeMap(dealership_uid => this.af.database.object(`/Dealerships/${dealership_uid}`)
                      , (dealership_uid, dealership) => ({dealership}))
            .mergeMap(({dealership}) =>
              Observable.from(dealership.users)
                .mergeMap(({role, uid}) => Observable.from(this.af.database.object(`/Users/${uid}`)), ({role, uid}, user) => ({role, user}) )
                .take(dealership.users.length)
                .filter(({role, user}) => user.$key != "undefined")
                .toArray()
            , ({dealership}, users) => ({dealership, users}))
            .mergeMap(({dealership, users}) =>
              Observable.from(dealership.products)
                .mergeMap( uid => this.af.database.object(`/Product Building/${uid}`), (uid, product) => ({product}) )
                .take(dealership.products.length)
                .filter(({product}) => product.$key != "undefined")
                .toArray()
              , ({dealership, users}, products) => ({dealership, users, products}) )
              // .mergeAll();

          this._dealerships.subscribe(dealership => console.log("Dealership: ", dealership));

          observer.next(this._dealerships);
          observer.complete();

        });

    });
  }

  // login(email: string, password: string, success: any, error: any) {
  //   this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
  //   .then(_success => {
  //     this.auth_val = _success;
  //     this._info = this.af.database.object(`/Users/${_success.uid}`);
  //     this._info.subscribe(info => {
  //
  //       // project manager logic
  //       if(info.group === "project manager") {
  //         var dealerships = [];
  //         for(let idx in info.dealerships) {
  //           dealerships.push(this.af.database.object(`/Dealerships/${info.dealerships[idx]}`));
  //         }
  //         this._dealerships.next(dealerships);
  //         dealerships = [];
  //       }
  //     });
  //     success(_success);
  //     this.loggedIn = true;
  //     this._login_observable.next(true);
  //   })
  //   .catch(_error => {
  //     error(_error);
  //     this.loggedIn = false;
  //     this._login_observable.next(false);
  //   });
  // }

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

  // get dealerships(): BehaviorSubject<FirebaseObjectObservable<any>[]> {
  //   return this._dealerships;
  // }

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
  }

}
