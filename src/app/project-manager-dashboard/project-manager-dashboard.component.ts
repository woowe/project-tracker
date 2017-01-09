import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';
import { MdDialog, MdDialogRef } from '@angular/material';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-project-manager-dashboard',
  templateUrl: './project-manager-dashboard.component.html',
  styleUrls: ['./project-manager-dashboard.component.css']
})
export class ProjectManagerDashboardComponent implements OnInit {

  info: FirebaseObjectObservable<any>;
  dealerships: BehaviorSubject<any>;

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router,
              private userInfo: UserInfoService, public dialog: MdDialog) { }

  ngOnInit() {
    this.userInfo.login_observable.subscribe(loggedIn => {
      console.log('Login observable: ', loggedIn);
      if(loggedIn) {
        this.info = this.userInfo.info;
        this.dealerships = this.userInfo.dealerships;
      }
    });
  }

  openDialog() {
    console.log('open dialog clicked!');
    let dialogRef = this.dialog.open(AddDealershipDialog, {
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add-dealership-dialog.component.html',
  styleUrls: ['./add-dealership-dialog.component.css'],
  animations: [
    trigger('productState', [
      state('scrolled-up', style({ height: "0" })),
      state('scrolled-down', style({ height: "*" })),
      transition("scrolled-up => scrolled-down", animate(`750ms ease`)),
      transition("scrolled-down => scrolled-up", animate(`750ms ease`)),
    ])
  ]
})
export class AddDealershipDialog {
  selected_products: string[] = [];
  last_selected_product: string = null;
  scroll_state: string = "scrolled-up";
  constructor(private productLogos: ProductLogosService, public dialogRef: MdDialogRef<AddDealershipDialog>) {}
  selectProduct(alt: string) {
    console.log('Selected Product: ', alt);
    this.last_selected_product = alt;
    this.selected_products.push(alt);
    this.scroll_state = "scrolled-down";
  }
  deselectProduct(alt: string) {
    console.log('Deselected Product: ', alt);
    var idx = this.selected_products.indexOf(alt);
    if(idx >= 0) {
      this.selected_products.splice(idx, 1);
      this.last_selected_product = null;
      this.scroll_state = "scrolled-up";
    }
  }
}
