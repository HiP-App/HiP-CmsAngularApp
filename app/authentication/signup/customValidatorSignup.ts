import {Control} from '@angular/common';
//import {FormControl} from '@angular/forms';

export class CustomValidatorSignup{
	
	constructor() {
		
	}

	static minPasswordLength(control:Control)
	{
		if(control.value.length>=6)
			return null

		return{passwordLengthIncorrect: true}
	}

	
}