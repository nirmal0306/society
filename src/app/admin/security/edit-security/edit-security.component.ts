import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service'; // import SweetAlert service
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-security',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-security.component.html',
  styleUrls: ['./edit-security.component.css']
})
export class EditSecurityComponent implements OnInit {

  securityId!: string;

  shifts: string[] = ['Morning', 'Evening', 'Night'];

  security = {
    name: '',
    email: '',
    mobile: '',
    shift: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  private API_URL = 'http://localhost:5000/api/security';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService // inject SweetAlert service
  ) {}

  ngOnInit(): void {
    this.securityId = this.route.snapshot.paramMap.get('id')!;
    this.loadSecurity();
  }

  loadSecurity() {
    this.http.get<any>(`${this.API_URL}/${this.securityId}`).subscribe({
      next: (data) => {
        this.security = {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          shift: data.shift
        };
        this.imagePreview = data.photo
          ? 'http://localhost:5000' + data.photo
          : null; // existing image
      },
      error: () => this.alert.error('Failed to load security staff', 'Load Error')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  updateSecurity() {
    if (!this.security.shift) {
      this.alert.error('Please select a shift', 'Validation Error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.security).forEach(
      ([key, value]) => formData.append(key, value)
    );

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.http.put(`${this.API_URL}/${this.securityId}`, formData).subscribe({
      next: () => {
        this.alert.success('Security staff updated successfully!');
        setTimeout(() => this.router.navigate(['/list-securities']), 1500);
      },
      error: () => this.alert.error('Error updating security staff', 'Update Failed')
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
