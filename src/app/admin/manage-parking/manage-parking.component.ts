import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../nav/admin-nav/admin-nav.component';

interface ParkingRequest {
  _id: string;
  residentName: string;
  residentEmail: string;
  block: string;
  flat: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  parkingNumber: string;
}

@Component({
  selector: 'app-manage-parking',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,AdminNavComponent],
  templateUrl: './manage-parking.component.html',
  styleUrls: ['./manage-parking.component.css']
})
export class ManageParkingComponent implements OnInit {

  API_URL = "http://localhost:5000/api/parking";

  parkingRequests: ParkingRequest[] = [];
  filteredRequests: ParkingRequest[] = [];
  paginatedRequests: ParkingRequest[] = [];
  loading = true;

  searchText = '';
  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 1;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.fetchParkingRequests();
  }

  /* ================= FETCH PARKING ================= */
  fetchParkingRequests() {
    this.loading = true;
    this.http.get<ParkingRequest[]>(this.API_URL).subscribe({
      next: (res) => {
        this.parkingRequests = res;
        this.loading = false;
        this.applyFilter();
      },
      error: () => {
        Swal.fire('Error', 'Failed to fetch parking requests', 'error');
        this.loading = false;
      }
    });
  }

  /* ================= SEARCH / FILTER ================= */
  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredRequests = this.parkingRequests.filter(p =>
      p.residentName.toLowerCase().includes(search) ||
      p.residentEmail.toLowerCase().includes(search) ||
      p.block.toLowerCase().includes(search) ||
      p.flat.toLowerCase().includes(search) ||
      p.vehicleType.toLowerCase().includes(search) ||
      p.vehicleNumber.toLowerCase().includes(search) ||
      p.parkingNumber.toLowerCase().includes(search) ||
      p.status.toLowerCase().includes(search)
    );

    this.currentPage = 1;
    this.calculatePagination();
  }

  /* ================= PAGINATION ================= */
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredRequests.length / this.recordsPerPage) || 1;

    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;

    this.paginatedRequests = this.filteredRequests.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.calculatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePagination();
    }
  }

  /* ================= APPROVE / REJECT ================= */
  approveRequest(parking: ParkingRequest) {
    Swal.fire({
      title: 'Enter Parking Number',
      input: 'text',
      inputPlaceholder: 'Parking Number',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.http.put(`${this.API_URL}/approve/${parking._id}`, { parkingNumber: result.value }).subscribe({
          next: () => this.fetchParkingRequests(),
          error: (err) => Swal.fire('Error', err.error?.message || 'Failed to approve', 'error')
        });
      }
    });
  }

  rejectRequest(parking: ParkingRequest) {
    Swal.fire({
      title: 'Are you sure to reject?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.put(`${this.API_URL}/reject/${parking._id}`, {}).subscribe({
          next: () => this.fetchParkingRequests(),
          error: (err) => Swal.fire('Error', err.error?.message || 'Failed to reject', 'error')
        });
      }
    });
  }
}
