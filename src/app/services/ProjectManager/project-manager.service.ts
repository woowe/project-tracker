import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";


@Injectable()
export class ProjectManagerService {
  _info: any;

  _dealerships: Observable<any>;

  constructor(private af: AngularFire) {
    this._dealerships = Observable.empty();
  }

  getProjectManagerInfo(auth): Observable<any> {
    return Observable.from(this.af.database.object(`/Users/${auth.uid}`))
      .filter(info => info.group == "project manager")
      .do(info => {
        // console.log("PM UPDATE: ", info);
        this._info = info;
      })
      .switchMap(info => {
        // make array in the [key, value] pairs
        let keys = [];
        for(let k in info.dealerships)
          if(info.dealerships[k]) keys.push([parseInt(k), info.dealerships[k]]);

        return Observable.from(keys)
          .mergeMap(([idx, dealership_uid]) => this.af.database.object(`/Dealerships/${dealership_uid}`)
            , ([idx, dealership_uid], dealership) => ({idx, dealership}))
          .switchMap(({idx, dealership}) =>
            Observable.combineLatest(
              Observable.from(dealership.users)
                .map(({role, uid}) => Observable.from(this.af.database.object(`/Users/${uid}`))
                  .map(user => ({role, user}))
                ).combineAll()
                .map(arr => (arr as any[]).filter(({role, user}) => user.$key !== undefined)),
              Observable.from(dealership.products)
                .map( uid => Observable.from(this.af.database.object(`/Product Building/${uid}`))
                  .map(product => ({product}))
                ).combineAll()
                .map(arr => (arr as any[]).filter(({product}) => product.$key !== undefined)),
              (users, products) => ({idx, dealership, users, products})
            )
          )
      });
  }

  get info(): any {
    return this._info;
  }

  get dealerships(): Observable<any> {
    return this._dealerships;
  }

  getAllProductTemplates() {
    return this.af.database.object('/Product Templates/');
  }
  getAllMilestoneTemplates() {
    return this.af.database.object('/Milestone Templates/');
  }

  ngOnDestroy() {
  }
}
