import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  showAlert = false;
  alertMsg = 'Please wait! We are login you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your are going to be logged.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      console.log(this.credentials);

      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (err) {
      console.error(err);
      this.alertMsg = 'An unexpected error occurred! Please try again later!';
      this.alertColor = 'red';
      this.inSubmission = false;

      return;
    }
    this.alertMsg = 'Your are successful login';
    this.alertColor = 'green';
  }
}
