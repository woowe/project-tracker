import { Component, OnInit, AfterViewInit, trigger, state, style, transition, animate } from '@angular/core';

import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { CustomerService } from '../services/Customer/customer.service';
import { FirebaseObjectObservable } from 'angularfire2';

import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-milestone-tracker',
  templateUrl: './milestone-tracker.component.html',
  styleUrls: ['./milestone-tracker.component.css'],
  animations: [
    trigger('milestoneFlyIn', [
      state('void', style({ transform: 'translateY(50%)', opacity: 0 })),
      state('in', style({ transform: 'translateY(0%)', opacity: 1 })),
      state('out', style({ transform: 'translateY(50%)', opacity: 0 })),
      transition("* => *", animate(`750ms 200ms ease`))
    ]),
  ]
})
export class MilestoneTrackerComponent implements OnInit, AfterViewInit {
  products;
  constructor(private productLogos: ProductLogosService, private router: Router, private userInfo: UserInfoService, private customer: CustomerService) { }

  getDate(product, milestone) {
    if(product && milestone) {
      return this.customer.getDayDiff(Date.parse(product.started), Date.parse(product.activation), milestone.days_differential);
    }
    return null;
  }

  getClass(status) {
    switch(status) {
      case 'In Progress':
        return 'in-progress event';
      case 'Needs Attention':
        return 'needs-attention event'
      case 'Complete':
        return 'complete event'
      default:
        break;
    }
    return 'event';
  }

  getIcon(status) {
    switch(status) {
      case 'In Progress':
        return 'loop';
      case 'Needs Attention':
        return 'error';
      case 'Complete':
        return 'done';
      default:
        break;
    }
    return '';
  }

  ngOnInit() {
    this.products = this.productLogos.getProductLogos().map(function (v) { return { logo_info: v } });
  }

  getDelay(i) {
    return {
      transitionDelay: (i + 1 * 0.5) + 's'
    };
  }

  ngAfterViewInit() {

    Observable.from(this.userInfo.auth)
      .filter(auth => auth != null)
      .first()
      .mergeMap(auth => this.customer.getCustomerInfo(auth))
      .mergeAll()
      .subscribe(({idx, product, milestones}) => {

        console.log("IDX, PRODUCT, MILESTONES", idx, product, milestones);
        this.products[idx].milestones = milestones;
        this.products[idx].product = product;
        this.products[idx].completion_info = this.customer.calculateMilestoneCompletion(product, milestones);
        this.products[idx].milestone_state = "in";

        console.log("PRODUCTS", this.products);
      });
      
  }

}
