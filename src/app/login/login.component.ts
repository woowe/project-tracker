import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

var enter_ms = 1000;
var look_ms = 1000;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('flyIn', [
      state('in', style({ transform: 'translatex(0)' })),
      state('start', style({ transform: 'translateX(calc(50vw + 50%))' })),
      state('end', style({ transform: 'translateX(calc(-50vw - 50%))' })),
      transition("* => *", animate(`${enter_ms}ms ease`))
    ]),
    trigger('overlayBackground', [
      state('in', style({ backgroundColor: 'rgba(0, 0, 0, 0.4)' })),
      state('out', style({ backgroundColor: 'rgba(0, 0, 0, 0)' })),
      transition("* => *", animate(`${enter_ms}ms ease`))
    ]),
    trigger('authBackground', [
      state('pending', style({ backgroundColor: '#42A5F5' })),
      state('success', style({ backgroundColor: '#66BB6A' })),
      state('fail', style({ backgroundColor: '#EF5350' })),
      transition("* => *", animate("200ms ease"))
    ]),
    trigger('progressScale', [
      state('in', style({ width: '27px', marginRight: '15px' })),
      state('out', style({ width: '0px', marginRight: '0px' })),
      transition("* => *", animate("200ms ease"))
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

  constructor(private productLogos: ProductLogosService, public af: AngularFire) {
  }

  reset_state() {
    // this.flyin_state = "start";
    this.loggingIn = false;
    this.background_state = "out";
    this.auth_back_state = "pending";
    this.progress_state = "in";
    this.auth_text = "Authenticating";
  }

  ngOnInit() {
    this.logos = this.productLogos.getLogos();
    this.af.auth.subscribe(auth => {
      if(auth != null) {
        this.loggingIn = true;
        this.flyin_state = "in";
        this.background_state = "in";
        setTimeout(() => {
          this.auth_text = "Success!";
          this.progress_state = "out";
          this.auth_back_state = "success";
        }, enter_ms + 500);
        setTimeout(() => {
          this.flyin_state = "end";
          this.background_state = "out";
          setTimeout(() => this.loggingIn = false, enter_ms);
        }, enter_ms + 1250);
      }
      console.log(auth);
    });
  }

  login(email: string, password: string) {
    this.reset_state();
    this.flyin_state = "in";
    // if(this.flyin_state !== "end") {
    //   this.flyin_state = "start";
    // }
    this.background_state = "in";
    this.loggingIn = true;
    this.af.auth.login({email: email, password: password},{ provider: AuthProviders.Password, method: AuthMethods.Password})
    .then(success => {
      console.log("Firebase success: " + JSON.stringify(success));
      this.auth_text = "Success!";
      this.progress_state = "out";
      this.auth_back_state = "success";
      setTimeout(() => {
        this.flyin_state = "end";
        this.background_state = "out";
        setTimeout(() => this.reset_state(), enter_ms);
      }, look_ms);
    })
    .catch(error => {
      console.log("Firebase error: " + JSON.stringify(error));
      this.auth_text = "Failed to log in!";
      this.progress_state = "out";
      this.auth_back_state = "fail";
      setTimeout(() => {
        this.flyin_state = "end";
        this.background_state = "out";
        setTimeout(() => this.reset_state(), enter_ms);
      }, look_ms);
    });
  }
}
