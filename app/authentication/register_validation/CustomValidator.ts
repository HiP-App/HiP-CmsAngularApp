import {Control} from '@angular/common';
//import {FormControl} from '@angular/forms';

export class CustomValidator{
	
	constructor() {
		
	}

	static underscore (control:Control)
	{
		if(control.value.indexOf('_')>=0)
			return null;

		return {underscoreNotFound:true}
	}

	static minPasswordLength(control:Control)
	{
		if(control.value.length>=6)
			return null

		return{passwordLengthIncorrect: true}
	}

	static patternMatchPassword(control:Control)
	{
		let passwordRegex = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&?><)(+=|~)])$"
		if(control.value.test(passwordRegex))
			return null

		return{passwordPatternIncorrect: true}
	}

}