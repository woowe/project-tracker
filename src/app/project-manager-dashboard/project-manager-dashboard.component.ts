import { Component, OnInit, trigger, state, style, transition, keyframes, animate } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { ProjectManagerService } from '../services/ProjectManager/project-manager.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-project-manager-dashboard',
  templateUrl: './project-manager-dashboard.component.html',
  styleUrls: ['./project-manager-dashboard.component.css']
})
export class ProjectManagerDashboardComponent implements OnInit {

  info: any;
  dealerships: any[] = [];

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router,
              private userInfo: UserInfoService, public dialog: MdDialog, private projectManager: ProjectManagerService) { }

  ngOnInit() {
    Observable.from(this.userInfo.auth).filter(auth => auth != null).first().subscribe(auth => {
      console.log('Logged in', auth);
      this.projectManager.getProjectManagerInfo(auth)
        // .mergeMap( dealerships => dealerships )
        // .mergeAll()
        .subscribe((dealership: any) => {
          console.log("DEALERSHIP INFO: ", this.projectManager.info, dealership);
          if(this.info !== this.projectManager.info) {
            this.info = this.projectManager.info;
          }
          if( dealership.idx > this.dealerships.length) {
            for(var i = 0; i < dealership.idx - this.dealerships.length; ++i)
              this.dealerships.push(null);
          }
          this.dealerships[dealership.idx] = dealership;
        });
      // this.info = this.userInfo.info;
      // this.dealerships = this.userInfo.dealerships;
      // this.openDialog();
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

  getPrimaryUser(users: any[]) {
    for(let user of users) {
      if(user.role === "primary") {
        return user.user;
      }
    }
    return null;
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './add-dealership-dialog.component.html',
  styleUrls: ['./add-dealership-dialog.component.css'],
  animations: [
    trigger('productState', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        animate(300, keyframes([
          style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
          style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
          style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ]),
      transition('* => void', [
        animate(300, keyframes([
          style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
          style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
          style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
        ]))
      ])
    ])
  ]
})
export class AddDealershipDialog {
  products: any[] = [];
  milestone_templates: any[] = [];
  scroll_state: string = "scrolled-down";
  selected_tab: number = 0;
  product_more_info: any = { name: null, selected: false, selected_milestone: null, selected_type: null };
  constructor(private productLogos: ProductLogosService, private userInfo: UserInfoService, public dialogRef: MdDialogRef<AddDealershipDialog>) {

    this.products = this.productLogos.getProductLogos().map(v => { return { name: v.alt, selected: false, selected_milestone: null, selected_type: null }; });
    this.userInfo.getAllProductTemplates().subscribe(templates => {
      for(let template of templates){
        var p = this.products.findIndex(v => { return v.name === template.name });
        if(p >= 0) {
          this.products[p].p_template = template;
          this.products[p].selected_type = template.types[template.default_type];
          this.products[p].selected_type.idx = template.default_type;
        }
      }
      console.log('Product templates: ', this.products);
    });
    this.userInfo.getAllMilestoneTemplates().subscribe(templates => {
      this.milestone_templates = templates;
      for(let p of this.products) {
        if(p.selected_type) {
          p.selected_milestone = templates[p.selected_type.default_milestone_template];
          p.selected_milestone.idx = p.selected_type.default_milestone_template;
        }
      }
      console.log('Milestone templates: ', this.milestone_templates);
    });
  }
  toggleProductSelect(idx: number) {
    if(this.products[idx]) {
      this.products[idx].selected = !this.products[idx].selected;
    }
  }
  selectProduct(idx: number) {
    if(this.products[idx]) {
      this.products[idx].selected = true;
    }
  }

  getProductCSS(idx: number) {
    if(this.products[idx]) {
      var sp = this.products[idx];
      return {
        backgroundColor: sp.selected ? '#2196F3' : '#fff',
        color: sp.selected ? '#fff' : '#2196F3'
      };
    }
    return null;
  }

  gotoTab(tab_num: number, idx: number) {
    this.selected_tab = tab_num;
    console.log('Selected tab: ', this.selected_tab);
    this.product_more_info = this.products[idx];
  }
}
