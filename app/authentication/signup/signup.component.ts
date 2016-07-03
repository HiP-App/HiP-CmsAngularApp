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
	message:string;
	registrationForm: ControlGroup;
	password: any;
	isError: boolean = false

	constructor(public router: Router, public http: Http, public formBuilder:FormBuilder)
	{
		this.registrationForm = formBuilder.group({
			email: ['',Validators.required], 
			password: ['',Validators.compose([Validators.required, Validators.pattern("(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*")
				,CustomValidatorSignup.minPasswordLength])],
			confirmPassword: ['',Validators.required]
			// matchingPassword: formBuilder.group({
			// 	password: ['',Validators.compose([Validators.required,CustomValidator.minPasswordLength])],
			// 	confirmPassword: ['',Validators.required]
			// }, {Validator:this.confirmPasswordValidator})
		});
	}

	onclick(password:any,confirmPassword:any)
	{	
		// console.log("Password is:"+password.value);
		// console.log("Password is:"+confirmPassword.value);
		if(password.value !== confirmPassword.value)
		{
			this.isError = true;
		}
		else{
			this.isError = false;
		}
	}


	signup(email:string,password:string,confirmPassword:string) {

		var contentHeaders = new Headers();
		this.registrationForm.value

		contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

		let body = "Email=" + email + "&Password=" + password + "&ConfirmPassword=" + confirmPassword;
		console.log("Body is:"+body)

		this.http.post('http://localhost:5001/auth/register', body, { headers: contentHeaders })
			.subscribe(
			response => {
				console.log("status code:"+response.status);
				console.log(response)
				this.router.parent.navigateByUrl('/login');
			},
			error => {
				this.errorMessage = <any>error;
				console.log(error.text());
				//return {isError:true}
			});
	}

	// login() {
	// 	event.preventDefault();
	// 	this.router.parent.navigateByUrl('/login');
	// }
}


