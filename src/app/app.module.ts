import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { ProductLogosService } from './services/ProductLogos/product-logos.service';

import 'hammerjs';
import { ProductSelectionComponent } from './product-selection/product-selection.component';

const myFirebaseConfig = {
  apiKey: "AIzaSyC_Qi-DazIAxVyIF_70y_B_80-hS-9tBkI",
  authDomain: "project-tracker-c98a9.firebaseapp.com",
  databaseURL: "https://project-tracker-c98a9.firebaseio.com",
  storageBucket: "project-tracker-c98a9.appspot.com",
  messagingSenderId: "508007150160"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProductSelectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig)
  ],
  entryComponents: [],
  providers: [ ProductLogosService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
