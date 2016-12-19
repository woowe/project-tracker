import { Component, OnInit, Optional } from '@angular/core';
import { ProductLogosService } from '../services/ProductLogos/product-logos.service';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  logos;
  lastDialogResult: string;

  constructor(private productLogos: ProductLogosService, private _dialog: MdDialog) { }

  ngOnInit() {
    this.logos = this.productLogos.getLogos();
  }

  private _openDialog(/*config?: MdDialogConfig*/) {
  }

  openDefault() {
    this._openDialog();
  }

}
