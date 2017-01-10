import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-milestone-editor',
  templateUrl: './milestone-editor.component.html',
  styleUrls: ['./milestone-editor.component.css']
})
export class MilestoneEditorComponent implements OnInit {
  milestone_model: any;
  @Output() milestoneModelChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  @Input()
  get milestoneModel() {
    return this.milestone_model;
  }

  set milestoneModel(model: any) {
    this.milestone_model = model;
    this.milestoneModelChange.emit(this.milestone_model);
  }

  onValueChange(v: any): void {
    console.log('changed: ', v);
  }

}
