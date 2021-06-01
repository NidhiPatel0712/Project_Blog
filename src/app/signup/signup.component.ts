import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthService} from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
 // first_name: string="";
 //last_name: string="";

  myForm: FormGroup;
  message: string="";
  userError: any;

  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router) {
    this.myForm = this.fb.group({
      firstName:['',[ Validators.required]],
      lastName:['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]],
      confirmPassword:['',[Validators.required]]

    },
    {
      validator: this.checkIfMatchingPasswords("password", "confirmPassword") 
    })
    
  }

  checkIfMatchingPasswords(passwordKey: string, confirmPasswordKey: string){
     return(group: FormGroup) =>{
       let password = group.controls[passwordKey];
       let confirmPassword = group.controls[confirmPasswordKey];

       if(password.value == confirmPassword.value){
         return;
       }
       else{
         confirmPassword.setErrors({
           notEqualToPassword: true 
         })
       }
     }
   }

  onSubmit(signupform){
    let email: string = signupform.value.email;
    let password: string = signupform.value.password;
    let firstName: string = signupform.value.firstName;
    let lastName: string = signupform.value.lastName;
    
   // firebase.auth().createUserWithEmailAndPassword(email ,password)
    this.authService.signup(email,password, firstName, lastName).then((user: any)=>{
    /*  console.log(response);

      let randomNo = Math.floor(Math.random() * 1000)

      response.user.updateProfile({
        displayName: firstName + " " + lastName ,
        photoURL: "https://picsum.photos/"+ randomNo 
      } )
      .then(()=>{*/
        firebase.firestore().collection("users").doc(user.uid).set({
          firstName: signupform.value.firstName,
          lastName: signupform.value.lastName,
          email: signupform.value.email,
          photoURL: user.photoURL,
          interests: "",
          bio: "",
          hobbies: ""
        }).then(()=>{
          this.message = "you have been signed up successfully. Please login ."
          this.userError = null;
          this.router.navigate(['/myblogs'])
        })
     })
    
    
    .catch((error)=>{
      console.log(error);
      this.userError = error;
    })
  }

  ngOnInit() {
  }

}
