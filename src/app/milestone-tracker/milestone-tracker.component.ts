import { Component, OnInit, AfterViewInit, trigger, state, style, transition, animate } from '@angular/core';

import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { FirebaseObjectObservable } from 'angularfire2';

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
  constructor(private productLogos: ProductLogosService, private router: Router, private userInfo: UserInfoService) { }

  getDate(product, milestone) {
    if(product && milestone) {
      return this.userInfo.getDayDiff(Date.parse(product.started), Date.parse(product.activation), milestone.days_differential);
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
    var p, m;
    p = this.userInfo.products;
    m = this.userInfo.milestones;
    p.combineLatest(m).subscribe(([products, milestones]) => {
      if(products && milestones) {
        for(var i = 0; i < products.length; ++i) {
          this.products[i].milestone = milestones[i];
          this.products[i].product = products[i];
          if(products[i] && milestones[i]) {
            var idx = i;
            products[i].combineLatest(milestones[i]).subscribe(([product, milestone]) => {
              console.log('COMBINDED SINGLE', product, milestone, this.products);
              this.products[idx].completion_info = this.userInfo.calculateMilestoneCompletion(product, milestone);
              this.products[idx].completion_info.subscribe(info => {
                this.products[idx].milestone_state = "in";
                console.log("AFTER VIEW INIT");
              })
            });
          }
        }
      }
    });
  }

}
