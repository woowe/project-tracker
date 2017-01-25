import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';

import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { CustomerService } from '../services/Customer/customer.service';
import { FirebaseObjectObservable } from 'angularfire2';

import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.css'],
  animations: [
    trigger('arcLoad', [
      state('start', style({ strokeDashoffset: -286, strokeDasharray: 286, stroke: 'white' })),
      state('end-bad', style({ strokeDashoffset: 0, strokeDasharray: 286, stroke: '#EF5350' })),
      state('end-good', style({ strokeDashoffset: 0, strokeDasharray: 286, stroke: '#66BB6A' })),
      transition("* => *", animate(`750ms ease`))
    ]),
    trigger('productState', [
      state('start', style({ color: 'white' })),
      state('end-bad', style({ color: '#EF5350' })),
      state('end-good', style({ color: '#66BB6A' })),
      transition("* => *", animate(`750ms ease`))
    ])
  ]
})
export class ProductSelectionComponent implements OnInit {
  product_info: any[];

  constructor(private productLogos: ProductLogosService, private router: Router, private userInfo: UserInfoService, private customer: CustomerService) {}

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  describeArc(x, y, radius, startAngle, endAngle){

      var start = this.polarToCartesian(x, y, radius, endAngle);
      var end = this.polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          "M", start.x, start.y,
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      return d;
  }

  getIcon(alt: string): string {
    switch(alt) {
      case "DealerSocket":
        return "trending_up";
      case "DealerFire":
        return "dashboard";
      case "Inventory+":
        return "search";
      case "iDMS":
        return "directions_car";
      case "Revenue Radar":
        return "attach_money";
      default:
        break;
    }
  }

  ngOnInit() {
    this.product_info = this.productLogos.getProductLogos().map(function (v) { return { logo_info: v, arc_state: "start", product_state: "start" } });
    Observable.from(this.userInfo.auth)
      .filter(auth => auth != null)
      .first()
      .mergeMap(auth => this.customer.getCustomerInfo(auth))
      .mergeAll()
      .subscribe(({idx, product, milestones}) => {

        console.log("IDX, PRODUCT, MILESTONES", idx, product, milestones);
        this.product_info[idx].milestones = milestones;
        this.product_info[idx].product = product;
        this.product_info[idx].completion_info = this.customer.calculateMilestoneCompletion(product, milestones);

        if(this.product_info[idx].status !== "On Schedule") {
          this.product_info[idx].arc_state = "end-bad";
          this.product_info[idx].product_state = "end-bad";
        } else {
          this.product_info[idx].arc_state = "end-good";
          this.product_info[idx].product_state = "end-good";
        }

      });
  }
}
