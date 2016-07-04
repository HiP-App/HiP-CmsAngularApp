import {Control} from '@angular/common';

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