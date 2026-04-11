import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { ANavComponent } from '../../nav/a-nav/a-nav.component';
import { API_URL } from '../../app.config';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule,ANavComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  resetForm: FormGroup;
  loading = false;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService
  ) {

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }
  showPassword = false;
  showConfirmPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  onReset() {
    if (this.resetForm.invalid) {
      this.alert.error('Please fill all fields correctly');
      return;
    }

    this.loading = true;

    const body = {
      email: this.email,
      password: this.resetForm.value.password
    };

    this.http.post(`${API_URL}/admin/reset-password`, body)
      .subscribe({
        next: () => {
          this.alert.success('Password updated successfully!');
          this.router.navigate(['/admin-login']);
          this.loading = false;
        },
        error: () => {
          this.alert.error('Reset failed');
          this.loading = false;
        }
      });
  }
}
