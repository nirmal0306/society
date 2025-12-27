import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-resident',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-resident.component.html',
  styleUrls: ['./edit-resident.component.css']
})
export class EditResidentComponent implements OnInit {

  residentId!: string;

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
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService  // inject AlertService
  ) {
    this.generateFlats();
  }

  ngOnInit(): void {
    this.residentId = this.route.snapshot.paramMap.get('id')!;
    this.loadResident();
  }

  generateFlats() {
    this.flats = [];
    for (let floor = 1; floor <= 5; floor++) {
      for (let flat = 1; flat <= 6; flat++) {
        this.flats.push(`${floor}0${flat}`);
      }
    }
  }

  loadResident() {
    this.http.get<any>(`${this.API_URL}/${this.residentId}`).subscribe({
      next: (data) => {
        this.resident = {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          block: data.block,
          flat: data.flat
        };
        this.imagePreview = data.photo
          ? 'http://localhost:5000' + data.photo
          : null; // existing image
      },
      error: () => this.alert.error('Failed to load resident', 'Error')
    });
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

  updateResident() {
    if (!this.resident.block || !this.resident.flat) {
      this.alert.error('Please select block and flat', 'Validation Error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.resident).forEach(
      ([key, value]) => formData.append(key, value)
    );

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.http.put(`${this.API_URL}/${this.residentId}`, formData).subscribe({
      next: () => {
        this.alert.success('Resident updated successfully!');
        setTimeout(() => this.router.navigate(['/list-residents']), 1500);
      },
      error: () => this.alert.error('Error updating resident', 'Update Failed')
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
