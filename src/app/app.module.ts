import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ProductLogosService } from './services/ProductLogos/product-logos.service';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot()
  ],
  entryComponents: [],
  providers: [ ProductLogosService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
