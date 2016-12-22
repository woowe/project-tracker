import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { UserInfoService } from '../UserInfo/user-info.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private user_info: UserInfoService, private router: Router) { }

  canActivate() {
    if(!this.user_info.loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
