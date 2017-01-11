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
  selector: 'app-milestone-editor',
  templateUrl: './milestone-editor.component.html',
  styleUrls: ['./milestone-editor.component.css'],
  animations: [
    trigger('buttonState', [
      state('blow-up', style({transform: 'translate3d(0%, 0%, 0) scale(25)', opacity: 0, zIndex: 0, color: "#448aff"})),
      state('out', style({transform: 'translate3d(0%, 0%, 0) scale(0)', opacity: 0, zIndex: 1, color: "#fff"})),
      state('in', style({transform: 'translate3d(0%, 0%, 0) scale(1)', opacity: 1, zIndex: 1, color: "#fff"})),
      transition("in => out", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("out => in", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("in => blow-up", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("blow-up => in", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      // transition("void => *", animate("0.45s cubic-bezier(.4, 0, .2, 1)"))
    ]),
    trigger('addFormState', [
      state('out', style({display: 'block', background: 'transparent', padding: '0px', boxShadow: '0 3px 5px -1px rgba(0,0,0,0), 0 6px 10px 0 rgba(0,0,0,0), 0 1px 18px 0 rgba(0,0,0,0)', width: '63px', height: '69px'})),
      state('in', style({display: 'block', background: "#fff", padding: '24px', boxShadow: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)', width: 'calc(100% - 65px)', height: "*"})),
      state('disapear', style({display: 'none'})),
      transition("in => out", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("out => in", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("out => disapear", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      transition("disapear => out", animate("0.45s cubic-bezier(.4, 0, .2, 1)")),
      // transition("void => *", animate("0.45s cubic-bezier(.4, 0, .2, 1)"))
    ]),
    trigger('formState', [
      state('out', style({display: 'none', opacity: 0})),
      state('in', style({display: 'block', opacity: 1})),
      transition("out => in", animate("0.2s 0.345s cubic-bezier(.4, 0, .2, 1)")),
      transition("in => out", animate("0.345s cubic-bezier(.4, 0, .2, 1)"))
      // transition("void => *", animate("280ms cubic-bezier(.4, 0, .2, 1)"))
    ]),
  ]
})
export class MilestoneEditorComponent implements OnInit, AfterViewInit {
  milestone_model: any;
  button_state = "in";
  add_form_state = "out";
  form_state = "out";
  previous_scroll = 0;

  @ViewChild('addFabButton') button;
  @Output() milestoneModelChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // console.log(this._renderer.selectRootElement('button'));
    console.log(this.button._elementRef.nativeElement);
  }

  ngAfterViewInit() {
  }

  @Input()
  get milestoneModel() {
    return this.milestone_model;
  }

  set milestoneModel(model: any) {
    this.milestone_model = model;
    this.milestoneModelChange.emit(this.milestone_model);
  }

  _getAddFabButton() {
    // console.log(this.button.nativeElement);
    return this.button._elementRef.nativeElement;
  }

  onValueChange(v: any): void {
    console.log('changed: ', v);
  }

  onAddFabClicked(e) {
    this.button_state = "blow-up";
    this.add_form_state = "in";
    this.form_state = "in";
  }

  onAddFormCancel() {
    this.button_state = "in";
    this.add_form_state = "out";
    this.form_state = "out";
  }

  onAddFormAdd() {
  }

  onAddFormClear() {

  }

  onListScroll(e) {
    // console.log('scrolling ', e.target.scrollTop - this.previous_scroll);
    if(this.button_state !== 'blow-up') {
      if(e.target.scrollTop - this.previous_scroll > 0 && this.button_state !== 'out') {
        this.button_state = 'out';
        this.add_form_state = 'disapear';
      } else if(e.target.scrollTop - this.previous_scroll < 0 && this.button_state !== 'in') {
        this.button_state = 'in';
        this.add_form_state = 'out';
      }
    }
    this.previous_scroll = e.target.scrollTop;
  }

}
