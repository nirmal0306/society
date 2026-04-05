
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule,ResidentNavComponent],
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.css']
})
export class ParkingComponent implements OnInit {

  API_URL = "http://localhost:5000/api/parking";
  PROFILE_API = "http://localhost:5000/api/residents/profile";

  resident: any = null;
  parkingData: any = null;

  parking = {
    vehicleType: '',
    vehicleNumber: ''
  };

  loading = true;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchResident();
  }

  /* ================= FETCH RESIDENT PROFILE ================= */
  fetchResident() {
    const email = localStorage.getItem("email");

    this.http.get<any>(`${this.PROFILE_API}/${email}`).subscribe({
      next: (res) => {
        this.resident = res;
        this.fetchParking();
      },
      error: () => {
        Swal.fire("Error", "Failed to load resident profile", "error");
        this.loading = false;
      }
    });
  }

  /* ================= FETCH PARKING DATA ================= */
  fetchParking1() {
    if (!this.resident?.email) return;

    this.http.get(`${this.API_URL}/resident/${this.resident.email}`).subscribe({
      next: (res: any) => {
        this.parkingData = res;
        this.loading = false;
      },
      error: () => {
        this.parkingData = null;
        this.loading = false;
      }
    });
  }

  fetchParking() {
  if (!this.resident?.email) return;

  this.http.get(`${this.API_URL}/resident/${this.resident.email}`).subscribe({
    next: (res: any) => {
      this.parkingData = Array.isArray(res) ? res : [res]; // 🔥 FIX
      this.loading = false;
    },
    error: () => {
      this.parkingData = [];
      this.loading = false;
    }
  });
}

  /* ================= SUBMIT PARKING REQUEST ================= */
  submitRequest() {
    if (!this.parking.vehicleType || !this.parking.vehicleNumber) {
      Swal.fire("Error", "Fill all fields", "error");
      return;
    }

    const data = {
      residentName: this.resident.name,
      residentEmail: this.resident.email,
      block: this.resident.flats?.[0]?.block,
      flat: this.resident.flats?.[0]?.flat,
      vehicleType: this.parking.vehicleType,
      vehicleNumber: this.parking.vehicleNumber
    };

    Swal.fire({ title: "Sending request...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    this.http.post(this.API_URL, data).subscribe({
      next: (res: any) => {
        Swal.fire("Success", res.message || "Request sent", "success");
        this.fetchParking();
      },
      error: (err) => {
        Swal.fire("Error", err.error?.message || "Failed to send request", "error");
      }
    });
  }

  /* ================= CHECK PARKING LIMIT ================= */
hasMaxParking(): boolean {
  if (!this.parkingData) return false;

  // If backend sends array of parkings
  if (Array.isArray(this.parkingData)) {
    return this.parkingData.length >= 2;
  }

  // If single object but has count
  if (this.parkingData?.totalSlots) {
    return this.parkingData.totalSlots >= 2;
  }

  return false;
}
}
