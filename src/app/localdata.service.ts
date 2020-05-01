import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocaldataService {

	constructor() { }

	localData = window.localStorage.getItem('planifyData');
	
	// start getTaskData
	getTaskData() {
		if (this.localData) {
			return JSON.parse(this.localData);
		}
		else {
			return {
				"pending": {
					"data": []
				},
				"inprocess": {
					"data": []
				},
				"completed": {
					"data": []
				}


			}
		}
	}
	// end getTaskData
}

