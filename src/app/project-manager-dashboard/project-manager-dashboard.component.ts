import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-project-manager-dashboard',
  templateUrl: './project-manager-dashboard.component.html',
  styleUrls: ['./project-manager-dashboard.component.css']
})
export class ProjectManagerDashboardComponent implements OnInit {

  info: FirebaseObjectObservable<any>;

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router, private userInfo: UserInfoService) { }

  ngOnInit() {
    this.userInfo.login_observable.subscribe(loggedIn => {
      console.log('Login observable: ', loggedIn);
      if(loggedIn) {
        // this.userInfo.info.subscribe(info => {
        //   console.log(info);
        // });
        this.info = this.userInfo.info;
      }
    });
  }

}
