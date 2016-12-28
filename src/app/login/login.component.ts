import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { Router } from '@angular/router';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { UserInfoService } from '../services/UserInfo/user-info.service';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

var enter_ms = 750;
var look_ms = 1250;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('flyIn', [
      state('in', style({ transform: 'scale(1)', opacity: 1 })),
      state('start', style({ transform: 'scale(1.5)', opacity: 0 })),
      state('end', style({ transform: 'scale(1.5)', opacity: 0 })),
      transition("* => *", animate(`${enter_ms}ms cubic-bezier(0.785, 0.135, 0.15, 0.86)`))
    ]),
    trigger('overlayBackground', [
      state('in', style({ backgroundColor: 'rgba(0, 0, 0, 0.4)' })),
      state('out', style({ backgroundColor: 'rgba(0, 0, 0, 0)' })),
      transition("* => *", animate(`${enter_ms}ms cubic-bezier(0.785, 0.135, 0.15, 0.86)`))
    ]),
    trigger('authBackground', [
      state('pending', style({ backgroundColor: '#42A5F5' })),
      state('success', style({ backgroundColor: '#66BB6A' })),
      state('fail', style({ backgroundColor: '#EF5350' })),
      transition("* => *", animate("200ms cubic-bezier(0.785, 0.135, 0.15, 0.86)"))
    ]),
    trigger('progressScale', [
      state('in', style({ width: '27px', marginRight: '15px' })),
      state('out', style({ width: '0px', marginRight: '0px' })),
      transition("* => *", animate("200ms cubic-bezier(0.785, 0.135, 0.15, 0.86)"))
    ]),
  ]
})
export class LoginComponent implements OnInit {
  logos;
  flyin_state = "start";
  loggingIn = false;
  background_state = "out";
  auth_back_state = "pending";
  progress_state = "in";
  auth_text: string = "Authenticating";
  loggedIn = null;

  constructor(private productLogos: ProductLogosService, public af: AngularFire, private router: Router, private userInfo: UserInfoService) {
  }

  reset_state() {
    this.flyin_state = "start";
    this.loggingIn = false;
    this.background_state = "out";
    this.auth_back_state = "pending";
    this.progress_state = "in";
    this.auth_text = "Authenticating";
  }

  navigate_to_next_page(group) {
    switch(group) {
      case "pm":
        this.router.navigate(['/product-selection']);
        break;
      case "customer":
        this.router.navigate(['/product-selection']);
        break;
      case "admin":
        this.router.navigate(['/product-selection']);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.logos = this.productLogos.getProductLogos();
    // this.userInfo.auth.subscribe(auth => {
      // if(auth != null) {
      //   this.loggingIn = true;
      //   this.flyin_state = "in";
      //   this.background_state = "in";
      //   this.loggedIn = true;
      //   setTimeout(() => {
      //     this.auth_text = "Success!";
      //     this.progress_state = "out";
      //     this.auth_back_state = "success";
      //   }, enter_ms + 500);
      //   setTimeout(() => {
      //     this.flyin_state = "end";
      //     this.background_state = "out";
      //     setTimeout(() => {
      //       this.reset_state()
      //       this.router.navigate(['/product-selection']);
      //     }, enter_ms);
      //   }, enter_ms + 1250);
      // }
    // });
  }

  login(email: string, password: string) {
    this.reset_state();
    this.flyin_state = "in";
    this.background_state = "in";
    this.loggingIn = true;
    this.userInfo.login(email, password,
    success => {
      console.log("Firebase success");
      this.auth_text = "Success!";
      this.progress_state = "out";
      this.auth_back_state = "success";
      setTimeout(() => {
        this.flyin_state = "end";
        this.background_state = "out";
        setTimeout(() => {
          this.loggedIn = true;
          this.reset_state();
          this.userInfo.info.subscribe(info => {
            console.log(info);
            this.navigate_to_next_page(info.group);
          });
        }, enter_ms);
      }, look_ms);
    },
    error => {
      console.log("Firebase error");
      this.auth_text = "Failed to log in!";
      this.progress_state = "out";
      this.auth_back_state = "fail";
      setTimeout(() => {
        this.flyin_state = "end";
        this.background_state = "out";
        setTimeout(() => {
          this.loggedIn = false;
          this.reset_state();
        }, enter_ms);
      }, look_ms);
    });
  }
}
