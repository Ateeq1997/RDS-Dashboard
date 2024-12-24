import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,  // Add this line
    RouterLink,
  ],
})
export class SignupComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', Validators.required],
      cpassword: ['', Validators.required],
      role: ['', Validators.required],  // Add this line
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(form: UntypedFormGroup) {
    return form.get('password')?.value === form.get('cpassword')?.value ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
  
    // Stop if the form is invalid
    if (this.authForm.invalid) {
      return;
    }
  
    // Send form data to the backend
    this.http.post('http://localhost:3000/signup', this.authForm.value)
      .subscribe(
        response => {
          console.log('Signup success:', response);
          this.router.navigate(['/authentication/signin']);  // Navigate after successful signup
        },
        error => {
          console.error('Signup error:', error);
        }
      );
  }
}
