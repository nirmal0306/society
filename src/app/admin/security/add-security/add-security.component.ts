import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service'; // import SweetAlert service
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-security',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.css']
})
export class AddSecurityComponent {

  security = {
    name: '',
    email: '',
    mobile: '',
    shift: '' // Added shift field
  };

  shifts: string[] = ['Morning', 'Afternoon', 'Night']; // Example shifts

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  private API_URL = 'http://localhost:5000/api/security';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService // inject SweetAlert service
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  addSecurity() {
    if (!this.security.shift) {
      this.alert.error('Please select shift', 'Validation Error');
      return;
    }

    if (!this.selectedFile) {
      this.alert.error('Please upload security photo', 'Validation Error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.security).forEach(
      ([key, value]) => formData.append(key, value)
    );
    formData.append('photo', this.selectedFile);

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        this.alert.success('Security added successfully!');
        setTimeout(() => this.router.navigate(['/list-securities']), 1500);
      },
      error: () => this.alert.error('Error adding security', 'Add Failed')
    });
  }

  logout() {
      localStorage.clear();
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/admin-login']);
      });
    }
}
