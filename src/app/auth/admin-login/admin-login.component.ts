// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { AlertService } from '../../services/alert.service';
// import { RouterModule } from '@angular/router';
// import { ANavComponent } from '../../nav/a-nav/a-nav.component';
// @Component({
//   selector: 'app-admin-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule,ANavComponent],
//   templateUrl: './admin-login.component.html',
//   styleUrl: './admin-login.component.css'
// })
// export class AdminLoginComponent {
// loginForm: FormGroup;
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router,
//     private alert: AlertService
//   ) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required]
//     });
//   }

//   get f() {
//     return this.loginForm.controls;
//   }

//   showPassword = false;

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   onLogin(): void {
//     if (this.loginForm.invalid) {
//       this.alert.error('Please fill all fields correctly!');
//       return;
//     }

//     this.loading = true;

//     this.http.post<any>('http://localhost:5000/admin/login', this.loginForm.value).subscribe({
//       next: (res) => {
//         if (res.token) {
//           localStorage.setItem('token', res.token);
//           localStorage.setItem('email', this.loginForm.value.email);
//           localStorage.setItem('name', res.name || this.loginForm.value.email);

//           this.alert.success(`Welcome back, ${res.name || this.loginForm.value.email}!`);
//           setTimeout(() => this.router.navigate(['/admin-home']), 1500);
//         } else {
//           this.alert.error('Token not received!', 'Login Failed');
//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.alert.error('Invalid email or password!', 'Login Failed');
//         this.loading = false;
//       }
//     });
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { RouterModule } from '@angular/router';
import { ANavComponent } from '../../nav/a-nav/a-nav.component';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ANavComponent
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  loginForm: FormGroup;
  loading = false;

  showPassword = false;

  // Forgot password
  showForgot = false;
  forgotEmail = '';

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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.alert.error('Please fill all fields correctly!');
      return;
    }

    this.loading = true;

    this.http.post<any>('http://localhost:5000/admin/login', this.loginForm.value).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', this.loginForm.value.email);
          localStorage.setItem('name', res.name || this.loginForm.value.email);

          this.alert.success(`Welcome back, ${res.name || this.loginForm.value.email}!`);
          setTimeout(() => this.router.navigate(['/admin-home']), 1500);
        } else {
          this.alert.error('Token not received!', 'Login Failed');
        }
        this.loading = false;
      },
      error: () => {
        this.alert.error('Invalid email or password!', 'Login Failed');
        this.loading = false;
      }
    });
  }

  // -------------------------------
  // FORGOT PASSWORD
  // -------------------------------

  openForgotPassword() {
    this.forgotEmail = '';
    this.showForgot = true;
  }

  closeForgotPassword() {
    this.showForgot = false;
  }

  sendResetLink() {
    if (!this.forgotEmail) {
      this.alert.error('Enter email');
      return;
    }

    const resetLink = `http://localhost:4200/reset-password?email=${this.forgotEmail}`;

    const templateParams = {
      email: this.forgotEmail,
      link: resetLink
    };

    emailjs.send(
      'service_qi5lelt',
      'template_dudi1xa',
      templateParams,
      'glnahPLXPdrZK_OcP'
    ).then(() => {
      this.alert.success('Reset email sent successfully!');
      this.showForgot = false;
    }).catch((err) => {
      console.error(err);
      this.alert.error('Failed to send email');
    });
  }
}
