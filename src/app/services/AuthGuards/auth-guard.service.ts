import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserInfoService } from '../UserInfo/user-info.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private user_info: UserInfoService, private router: Router) { }

  canActivate() {
    if(!this.user_info.loggedIn) {
      this.router.navigate(['/login']);
      // this.user_info.login("test_cust@dealersocket.com", "projecttracker",
      // success => {
      //   console.log("Firebase success");
      // },
      // error => {
      //   console.log("Firebase error");
      // });
      return false;
    }
    return true;
  }

}
