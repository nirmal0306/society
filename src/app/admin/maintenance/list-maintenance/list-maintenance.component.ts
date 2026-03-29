import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

interface Payment {
  residentName: string;
  block: string;
  flat: string;
  month: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-list-maintenance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './list-maintenance.component.html',
  styleUrls: ['./list-maintenance.component.css']
})
export class ListMaintenanceComponent implements OnInit {

  API = "http://localhost:5000/api/maintenance";

  payments: Payment[] = [];
  filtered: Payment[] = [];
  paginated: Payment[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadAll();
  }

  /* LOAD DATA */
  loadAll() {
    this.http.get<Payment[]>(`${this.API}/all-data`).subscribe({
      next: (res) => {
        this.payments = res || [];
        this.applyFilter();
      },
      error: () => Swal.fire("Error", "Failed to load data", "error")
    });
  }

  /* SEARCH FILTER */
  applyFilter() {
    const s = this.searchText.toLowerCase();

    this.filtered = this.payments.filter(p =>
      p.block.toLowerCase().includes(s) ||
      p.flat.toLowerCase().includes(s) ||
      p.month.toLowerCase().includes(s) ||
      p.residentName.toLowerCase().includes(s)
    );

    this.currentPage = 1;
    this.applySort();
    this.updatePagination();
  }

  /* SORT FUNCTION */
  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
    this.updatePagination();
  }

  applySort() {
    if (!this.sortColumn) return;

    this.filtered.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // If numeric
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // If string
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /* PAGINATION */
  updatePagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginated = this.filtered.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /* NAVIGATION & MENU */
  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  maintenanceOpen = false;
  noticeOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleServices() { this.servicesOpen = !this.servicesOpen; }
  toggleResidents() { this.residentsOpen = !this.residentsOpen; }
  toggleSecurity() { this.securityOpen = !this.securityOpen; }
  toggleVisitors() { this.visitorsOpen = !this.visitorsOpen; }
  toggleEvent() { this.eventOpen = !this.eventOpen; }
  toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }
  toggleNotice() { this.noticeOpen = !this.noticeOpen; }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          timer: 1200,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/admin-login']));
      }
    });
  }
}
