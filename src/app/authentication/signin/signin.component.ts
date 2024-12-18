import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  authForm!: UntypedFormGroup;
  hide = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.http.post('http://localhost:3000/signin', this.authForm.value)
      .subscribe(
        (response: any) => {
          console.log('Signin success:', response);
          // Handle successful signin, such as storing tokens and navigating
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Signin error:', error);
        }
      );
  }

  adminSet() {
    // Logic to set admin user
  }

  doctorSet() {
    // Logic to set doctor user
  }

  patientSet() {
    // Logic to set patient user
  }
}
