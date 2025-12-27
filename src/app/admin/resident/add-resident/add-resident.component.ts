import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service'; // import SweetAlert service
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-resident',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.css']
})
export class AddResidentComponent {

  showBlock = false;
  showFlat = false;

  blocks: string[] = ['A','B','C','D','E','F','G','H','I','J'];
  flats: string[] = [];

  resident = {
    name: '',
    email: '',
    mobile: '',
    block: '',
    flat: ''
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  private API_URL = 'http://localhost:5000/api/residents';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertService  // inject AlertService
  ) {
    this.generateFlats();
  }

  generateFlats() {
    this.flats = [];
    for (let floor = 1; floor <= 5; floor++) {
      for (let flat = 1; flat <= 6; flat++) {
        this.flats.push(`${floor}0${flat}`);
      }
    }
  }

  toggleBlock() {
    this.showBlock = !this.showBlock;
    this.showFlat = false;
  }

  toggleFlat() {
    this.showFlat = !this.showFlat;
    this.showBlock = false;
  }

  selectBlock(block: string) {
    this.resident.block = block;
    this.showBlock = false;
  }

  selectFlat(flat: string) {
    this.resident.flat = flat;
    this.showFlat = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  addResident() {
    if (!this.resident.block || !this.resident.flat) {
      this.alert.error('Please select block and flat', 'Validation Error');
      return;
    }

    if (!this.selectedFile) {
      this.alert.error('Please upload resident photo', 'Validation Error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.resident).forEach(
      ([key, value]) => formData.append(key, value)
    );
    formData.append('photo', this.selectedFile);

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        this.alert.success('Resident added successfully!');
        setTimeout(() => this.router.navigate(['/list-residents']), 1500);
      },
      error: () => this.alert.error('Error adding resident', 'Add Failed')
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
