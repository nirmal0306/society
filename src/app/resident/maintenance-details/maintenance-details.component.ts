import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';

interface Payment {
  block: string;
  flat: string;
  month: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

interface FlatStatus {
  block: string;
  flat: string;
  status: string;
}

@Component({
  selector: 'app-maintenance-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,ResidentNavComponent],
  templateUrl: './maintenance-details.component.html',
  styleUrls: ['./maintenance-details.component.css']
})
export class MaintenanceDetailsComponent implements OnInit {

  RESIDENT_API = "http://localhost:5000/api/residents";
  MAINTENANCE_API = "http://localhost:5000/api/maintenance";

  residentId: string = '';
  resident: any = {};
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  paginatedPayments: Payment[] = [];
  flatStatus: FlatStatus[] = [];

  searchText: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadResidentAndMaintenance();
  }

  /* ================= LOAD RESIDENT & PAYMENTS ================= */
  loadResidentAndMaintenance() {
    const email = localStorage.getItem("email");

    // Get resident profile
    this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`).subscribe({
      next: (res) => {
        this.resident = res;
        this.residentId = res._id;

        // Load maintenance data for resident
        this.loadMaintenance();
      },
      error: () => {
        Swal.fire("Error", "Failed to load profile", "error");
      }
    });
  }

  loadMaintenance() {
    this.http.get<any>(`${this.MAINTENANCE_API}/data?residentId=${this.residentId}`)
      .subscribe({
        next: (res) => {
          this.payments = res.payments || [];
          this.flatStatus = res.flatStatus || [];

          this.applyFilter();
        },
        error: () => {
          Swal.fire("Error", "Failed to load maintenance data", "error");
        }
      });
  }

  /* ================= SEARCH FILTER ================= */
  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredPayments = this.payments.filter(p =>
      p.block.toLowerCase().includes(search) ||
      p.flat.toLowerCase().includes(search) ||
      p.month.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  /* ================= SORTING ================= */
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredPayments.sort((a: any, b: any) => {
      const valA = a[column];
      const valB = b[column];
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.calculatePagination();
  }

  /* ================= PAGINATION ================= */
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredPayments.length / this.pageSize);
    this.paginatedPayments = this.filteredPayments.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
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
}
