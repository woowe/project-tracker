import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, AngularFireAuth, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from "rxjs/Rx";

@Injectable()
export class CustomerService {
  _info: any;

  _project_manager: any;
  _dealership: any;

  _products: Observable<any>;

  constructor(private af: AngularFire) {
    this._products = Observable.empty();
  }

  getCustomerInfo(auth): Observable<any> {
    return Observable.create(observer => {
      // make sure this user is apart of the customer group
      // use switchMaps to combine the queries into the stream
      Observable.from(this.af.database.object(`/Users/${auth.uid}`))
        .filter(info => info.group == "customer")
        .switchMap(info => this.af.database.object(`/Users/${info.project_manager}`),
          (info, pm) => ({info, pm}))
        .switchMap(({info, pm}) => this.af.database.object(`/Dealerships/${info.dealership}`),
          ({info, pm}, dealership) => ({info, pm, dealership}))
        .do(({info, pm, dealership}) => {
          this._info = info;
          this._project_manager = pm;
          this._dealership = dealership;
        })
        .map(({info, pm, dealership}) => dealership.products)
        .subscribe(products => {
          // make array in the [key, value] pairs
          let keys = [];
          for(let k in products)
            if(products[k]) keys.push([k, products[k]]);

          // making an ovbservable from the array
          // make a switch map with an observable that emits the product, milestones pairs
          // flatten it out to emit {idx, product, milestones}
          this._products = Observable.from(keys)
          .switchMap(([idx, product_uid]) => Observable.from(this.af.database.object(`/Product Building/${product_uid}`))
            .switchMap(product => this.af.database.object(`/Milestone Building/${product.template}`),
                      (product, milestones) => ({product, milestones})),
            ([idx, product_uid], {product, milestones}) => ({idx, product, milestones}));

            observer.next(this._products);
            observer.complete();
        });

    });
  }

  get info(): any {
    return this._info;
  }

  get project_manager(): any {
    return this._project_manager;
  }

  get products(): Observable<any> {
    return this._products;
  }

  getDayDiff(start_ms: number, end_ms: number, days_diff: number) {
    var days_diff_ms = Math.abs(days_diff) * 86400000;
    return (days_diff >= 0) ? start_ms + days_diff_ms : end_ms - days_diff;
  }

  calculateMilestoneCompletion(p_info: any, m_info: any): any {
    if(typeof p_info !== "object" || typeof m_info !== "object") {
      return null;
    }
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

    return {
      percent_complete: percent_complete * 100,
      status: need_attenion_milestones.length > 0 ? "Needs Attention" : "On Schedule",
      need_attenion_milestones: need_attenion_milestones
    };
  }

  ngOnDestroy() {
  }
}
