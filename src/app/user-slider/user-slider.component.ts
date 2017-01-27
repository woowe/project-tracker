import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  trigger,
  state,
  style,
  transition,
  animate,
  ViewChild,
  AfterViewInit
} from '@angular/core';

@Component({
  selector: 'user-slider',
  templateUrl: './user-slider.component.html',
  styleUrls: ['./user-slider.component.css']
})
export class UserSliderComponent implements OnInit {

  _users: any[] = [];
  _addUser_model: any = {};

  @Output() usersChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  @Input()
  get users() {
    return this._users;
  }

  set users(users: any[]) {
    console.log("USERS: ", users);
    if(users) {
      users = this._sortUsers(users);
    }
    this._users = users;
    this.usersChange.emit(this._users);
  }

  _sortUsers(users: any[]): any[] {
    var primary = [], secondary = [];
    for(let user of users) {
      switch(user.role) {
        case "primary":
          primary.push(user);
          break;
        case "secondary":
          secondary.push(user);
          break;
      }
    }
    return primary.concat(secondary);
  }

  _clearAddUser() {
    this._addUser_model = {};
  }

  _addUser() {
    this._users.push(this._addUser_model)
    this._users = this._sortUsers(this._users);
    this.usersChange.emit(this._users);
  }

}
