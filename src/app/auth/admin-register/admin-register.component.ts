import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {

  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onRegister(): void {

    // Validate form
    if (this.registerForm.invalid) {
      this.alert.error('Please fill all fields correctly!');
      return;
    }

    // Confirm password check
    if (this.registerForm.value.password !== this.registerForm.value.confirm) {
      this.alert.error('Passwords do not match!');
      return;
    }

    this.loading = true;

    const payload = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    // Call backend
    this.http.post<any>('http://localhost:5000/admin/register', payload)
      .subscribe(
        (res) => {
          // SUCCESS
          this.alert.success('Admin Registered Successfully!');

          // Store data
          localStorage.setItem('token', res.token);
          localStorage.setItem('adminId', res._id);
          localStorage.setItem('name', res.name);
          localStorage.setItem('email', res.email);

          setTimeout(() => {
            this.router.navigate(['/admin-home']);
          }, 1500);

          this.loading = false;
        },

        (err) => {
          console.error(err);
          console.log(err);
          this.alert.error(err.error?.message || 'Registration Failed!');
          this.loading = false;
        }
      );
  }
}
