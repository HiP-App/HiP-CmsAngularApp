import {Component} from '@angular/core';
import {Control, ControlGroup, FormBuilder, Validators,Validator} from '@angular/common';
import {CustomValidator} from './CustomValidator';
//import {FormControl} from '@angular/forms';

@Component({
	selector: 'register',
	templateUrl: './app/authentication/register_validation/register.html',
})

export class RegisterComponent{
	registrationForm: ControlGroup;
	password: Control;

	constructor(formBuilder:FormBuilder)
	{
		//this.confirmPasswordValidator = this.confirmPasswordValidator.bind(this); 
		this.registrationForm = formBuilder.group({
			email: ['',Validators.compose([Validators.required, CustomValidator.underscore])], 
			//password: ['',Validators.compose([Validators.required,Validators.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&?><)(+=|~)])$"),CustomValidator.minPasswordLength])],
			//confirmPassword: ['',Validators.required]
			matchingPassword: formBuilder.group({
				password: ['',Validators.compose([Validators.required,CustomValidator.minPasswordLength])],
				confirmPassword: ['',Validators.required]
			}, {Validator:this.areEqual})
		});
	}

   areEqual(group: ControlGroup) {
   	var valid = false;

    
    for (name in group.controls) 
    {
      if (val === undefined) 
      {
       var val = group.controls[name].value
      } 
      else 
      {
        if (val !== group.controls[name].value) 
        {
          valid = false;
          break;
        }
      }
    }
    
    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
}
}
