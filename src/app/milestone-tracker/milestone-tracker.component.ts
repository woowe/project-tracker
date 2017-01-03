import { Component, OnInit } from '@angular/core';

import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-milestone-tracker',
  templateUrl: './milestone-tracker.component.html',
  styleUrls: ['./milestone-tracker.component.css']
})
export class MilestoneTrackerComponent implements OnInit {
  products;
  constructor(private productLogos: ProductLogosService,private router: Router, private userInfo: UserInfoService) { }

  ngOnInit() {
    this.products = this.productLogos.getProductLogos().map(function (v) { return { logo_info: v } });
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
            });
          }
        }
      }
    });
  }

}
