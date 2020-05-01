import { Component, OnInit } from '@angular/core';
import { LocaldataService } from './localdata.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  taskDetails = {
    formData: {
      title: "",
      description: "",
      // priority: "",
    },
    taskResponse: undefined,
    editableData: undefined,
    completedPer: 0
  };
  dateModel: NgbDateStruct;
  date: { year: number, month: number };

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.taskDetails.taskResponse.pending.data, event.previousIndex, event.currentIndex);
  }
  
  constructor(private localDataService: LocaldataService, private calendar: NgbCalendar){}
  
  ngOnInit() {
    this.taskDetails["taskResponse"] = this.localDataService.getTaskData();
    this.calculateCompletedPer();
    setTimeout(() => {
      $('[data-toggle="tooltip"]').tooltip();
    }, 1000);    
  }

  // start calculateCompletedPer
  calculateCompletedPer() {
    let totalTaskCount = this.taskDetails["taskResponse"]["pending"]["data"].length +
      this.taskDetails["taskResponse"]["inprocess"]["data"].length +
      this.taskDetails["taskResponse"]["completed"]["data"].length;
    let tempPer = (this.taskDetails["taskResponse"]["completed"]["data"].length / totalTaskCount) * 100;
    this.taskDetails["completedPer"] = parseInt(tempPer.toString());
  }
  // end calculateCompletedPer

  // start addEditTask
  addEditTask(actionType, detail, index) {
    console.log(actionType, detail, index)
    if (actionType === 'add') {
      this.taskDetails.editableData = {
        actionIndex: undefined,
        actionType: actionType
      }
      this.taskDetails.formData = {
        title: "",
        description: "",
        // priority: "",
      }
    }
    else {
      this.taskDetails.editableData = {
        actionIndex: index,
        actionType: actionType
      }
      this.taskDetails.formData = {
        title: detail.title,
        description: detail.description,
        // priority: detail.priority,
      }
      let tempDate = detail.date.split('/');
      this.dateModel = {
        day: tempDate[0],
        month: tempDate[1],
        year: tempDate[2]
      }
    }
  }
  // end addEditTask

  // start saveTask
  saveTask() {
    if (this.taskDetails.editableData.actionType === 'add') {
      $('#addEditModalCenter').modal('toggle');
      this.taskDetails["taskResponse"]["pending"]["data"].push({
        "title": this.taskDetails["formData"]["title"],
        "description": this.taskDetails["formData"]["description"],
        "priority": parseInt(this.taskDetails["formData"]["priority"]),
        "date": `${this.dateModel.day}/${this.dateModel.month}/${this.dateModel.year}`
      });
      this.setLocalData();
    }
    else {
      this.taskDetails["taskResponse"]["pending"]["data"][this.taskDetails.editableData.actionIndex] = {
        "title": this.taskDetails["formData"]["title"],
        "description": this.taskDetails["formData"]["description"],
        "priority": parseInt(this.taskDetails["formData"]["priority"]),
        "date": `${this.dateModel.day}/${this.dateModel.month}/${this.dateModel.year}`
      }
      $('#addEditModalCenter').modal('toggle');
      this.setLocalData();
    }
  }
  // end saveTask

  // start deleteTask
  deleteTask(status, index) {
    if (status === 'pending') {
      this.taskDetails["taskResponse"]["pending"]["data"].splice(index, 1);
      this.setLocalData();
    }
    else {
      this.taskDetails["taskResponse"]["inprocess"]["data"].splice(index, 1);
      this.setLocalData();
    }
  }
  // end deleteTask

  // start movetoInprocess
  movetoInprocess(detail, index) {
    this.taskDetails["taskResponse"]["inprocess"]["data"].push(detail);
    this.taskDetails["taskResponse"]["pending"]["data"].splice(index, 1);
    this.setLocalData();
  }
  // end movetoInprocess

  // start movetoCompleted
  movetoCompleted(detail, index) {
    this.taskDetails["taskResponse"]["completed"]["data"].push(detail);
    this.taskDetails["taskResponse"]["inprocess"]["data"].splice(index, 1);
    this.setLocalData();
  }
  // end movetoCompleted

  // start setLocalData
  setLocalData() {
    $('[data-toggle="tooltip"]').tooltip('hide')
    $('[data-toggle="tooltip"]').tooltip('enable')
    window.localStorage.setItem('planifyData', JSON.stringify(this.taskDetails["taskResponse"]));
    this.calculateCompletedPer();
  }
  // end setLocalData
  
  
}
