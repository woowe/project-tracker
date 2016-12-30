import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { FirebaseObjectObservable } from 'angularfire2';

import { Observable } from "rxjs/Rx";

@Component({
  selector: 'app-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.css'],
})
export class ProductSelectionComponent implements OnInit {
  product_info: any[];
  path: Observable<string>;

  constructor(private productLogos: ProductLogosService, private router: Router, private userInfo: UserInfoService) {
    // this.path = Observable.create(observer => {
    //   observer.i = 0;
    //   setInterval(() => {
    //     if(observer.i >= 360) {
    //       observer.next(describeArc(50, 50, 48.5, 0, 359.9));
    //       observer.complete();
    //     }
    //     observer.next(describeArc(50, 50, 48.5, 0, observer.i % 360));
    //     observer.i += 1;
    //   }, 16.67);
    // });
  }

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
    this.product_info = this.productLogos.getProductLogos().map(function (v) { return { logo_info: v } });
    var p, m;
    p = this.userInfo.products;
    p.subscribe(products => {
      var idx = 0;
      for(var product of products) {
        this.product_info[idx].product = product;
        // product.subscribe(p => {
        // });
        ++idx;
      }
    })
    m = this.userInfo.milestones;
    m.subscribe(milestones => {
      var idx = 0;
      for(var milestone of milestones) {
        this.product_info[idx].milestone = milestone;
        // this.product_info[idx].product.subscribe(p_info => {
        //   this.product_info[idx].percent_complete = this.userInfo.calculateMilestoneCompletion(p_info.$key, )
        // });
        // milestone.subscribe(m => {
          // this.product_info[idx].path = describeArc(50, 50, 48.5, 0, (m.percent_complete / 100) * 360);
        // });
        ++idx;
      }
    });
    p.combineLatest(m).subscribe(([products, milestones]) => {
      console.log("COMBINED: ", products, milestones);
      for(var i = 0; i < products.length; ++i) {
        if(products[i] && milestones[i]) {
          products[i].combineLatest(milestones[i]).subscribe(([product, milestone]) => {
            console.log('COMBINDED SINGLE', product, milestone);
            this.product_info[i].percent_complete = this.userInfo.calculateMilestoneCompletion(product, milestone);
          });
        }
      }
    });
    // for(var info of this.product_info) {
    //   info.product.combineLatest(info.milestone).map(([p_info, m_info]) => {
    //     console.log("RESULT FROM FORK JOIN: ", p_info, m_info);
    //   });
    // }
  }
}
