import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-visitor-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './visitor-login.component.html',
  styleUrl: './visitor-login.component.css'
})
export class VisitorLoginComponent {
 loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.alert.error('Please fill all fields correctly!');
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:5000/reslog', this.loginForm.value).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', this.loginForm.value.email);
          localStorage.setItem('name', res.name || this.loginForm.value.email);

          this.alert.success(`Welcome back, ${res.name || this.loginForm.value.email}!`);
          setTimeout(() => this.router.navigate(['/resident-home']), 1500);
        } else {
          this.alert.error('Token not received!', 'Login Failed');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.alert.error('Invalid email or password!', 'Login Failed');
        this.loading = false;
      }
    });
  }
}
