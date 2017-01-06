import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UserInfoService } from '../UserInfo/user-info.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private user_info: UserInfoService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.user_info.loggedIn) {
      // this.router.navigate(['/login']);
      var cust_routes: Array<string> = ["/product-selection", "/milestone-tracker"];
      var pm_routes: Array<string> = ["/pm-dashboard"];
      var username = "test_pm@dealersocket.com";
      var password = "projecttracker";
      console.log(state.url);
      if(cust_routes.indexOf(state.url) >= 0) {
        var username = "test_cust@dealersocket.com";
      }
      this.user_info.login(username, password,
      success => {
        console.log("Firebase success");
      },
      error => {
        console.log("Firebase error");
      });
      // return false;
    }
    return true;
  }

}
