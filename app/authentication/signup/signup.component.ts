import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router-deprecated';
import { CORE_DIRECTIVES, Control, ControlGroup, FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { Http,HTTP_PROVIDERS,Headers } from '@angular/http';
import { CustomValidatorSignup } from './CustomValidatorSignup';

@Component({
	selector: 'signup',
	directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
	templateUrl: './app/authentication/signup/signup.html',
	providers: [Http, HTTP_PROVIDERS],
    styleUrls: ['./assets/css/form-elements.css', './assets/css/style.css']

})
export class SignupComponent {
	errorMessage: string;
	registrationForm: ControlGroup;
	password: any;

	constructor(public router: Router, public http: Http, public formBuilder:FormBuilder)
	{
		this.registrationForm = formBuilder.group({
			email: ['',Validators.required], 
			password: ['',Validators.compose([Validators.required,Validators
				.pattern("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&?><)(+=|~)])$"),
				CustomValidatorSignup.minPasswordLength])],
			confirmPassword: ['',Validators.required]
			// matchingPassword: formBuilder.group({
			// 	password: ['',Validators.compose([Validators.required,CustomValidator.minPasswordLength])],
			// 	confirmPassword: ['',Validators.required]
			// }, {Validator:this.confirmPasswordValidator})
		});
	}

	// validatePassword(control:Control)
	// {	
	// 	if(control.value === this.password)
	// 		return null;

	// 	return {unEqualPassword:true}

	// }


	signup(Email:string,Password:string,ConfirmPassword:string) {

		var contentHeaders = new Headers();
		this.registrationForm.value

		contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

		let body = "Email=" + Email + "&Password=" + Password + "&ConfirmPassword=" + ConfirmPassword;

		this.http.post('http://localhost:5001/auth/register', body, { headers: contentHeaders })
			.subscribe(
			response => {
				console.log("status code:"+response.status);
				console.log(response)
				this.router.parent.navigateByUrl('/login');
			},
			error => {
				this.errorMessage;
				console.log(error.text());
				return {isError:true}
			});
	}

	// login() {
	// 	event.preventDefault();
	// 	this.router.parent.navigateByUrl('/login');
	// }
}


