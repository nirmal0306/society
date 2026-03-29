// ================= pending-maintenance.component.ts =================

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

export interface PendingPayment {
  residentName: string;
  block: string;
  flat: string;
  month: string;
  amount: number;
  method: string;
  date: string;
  status: string; // 'Pending'
}

interface Resident {
  _id: string;
  name: string;
  email: string;
  flats: { block: string; flat: string }[];
}

interface FlatStatus {
  block: string;
  flat: string;
  paidMonths: string[];
}

@Component({
  selector: 'app-pending-maintenance',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './pending-maintenance.component.html',
  styleUrls: ['./pending-maintenance.component.css']
})
export class PendingMaintenanceComponent implements OnInit {

  API = "http://localhost:5000/api/maintenance";
  RESIDENT_API = "http://localhost:5000/api/residents";

  pendingList: PendingPayment[] = [];
  filteredList: PendingPayment[] = [];
  paginatedList: PendingPayment[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  allMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadPending();
  }

 /** ================= LOAD PENDING ================= **/
async loadPending() {
  try {
    // 1️⃣ Get all residents
    const residents = await this.http.get<Resident[]>(`${this.RESIDENT_API}`).toPromise() || [];

    this.pendingList = [];

    // Get current month and day
    const today = new Date();
    const currentMonthIndex = today.getMonth(); // 0 = January
    const currentDay = today.getDate();

    // 2️⃣ For each resident
    for (const r of residents) {
      const resData = await this.http.get<{ flatStatus: FlatStatus[] }>(`${this.API}/data?residentId=${r._id}`).toPromise();
      const flatStatus: FlatStatus[] = resData?.flatStatus || [];

      r.flats.forEach(f => {
        const fs = flatStatus.find(s => s.block === f.block && s.flat === f.flat);
        const paidMonths = fs?.paidMonths || [];

        this.allMonths.forEach((month, idx) => {
          // Skip if already paid
          if (paidMonths.includes(month)) return;

          // Only show months up to current month
          if (idx > currentMonthIndex) return;

          // For current month, show only if day >= 16
          if (idx === currentMonthIndex && currentDay < 16) return;

          // Add to pending list
          this.pendingList.push({
            residentName: r.name,
            block: f.block,
            flat: f.flat,
            month,
            amount: 1180,
            method: 'UPI/Card',
            date: '',
            status: 'Pending'
          });
        });
      });
    }

    // Initialize filtered & pagination
    this.filteredList = [...this.pendingList];
    this.currentPage = 1;
    this.applySort();
    this.updatePagination();

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to load pending data", "error");
  }
}
  /** ================= SEARCH FILTER ================= **/
  applyFilter() {
    const s = this.searchText.toLowerCase();
    this.filteredList = this.pendingList.filter(p =>
      p.residentName.toLowerCase().includes(s) ||
      p.block.toLowerCase().includes(s) ||
      p.flat.toLowerCase().includes(s) ||
      p.month.toLowerCase().includes(s)
    );

    this.currentPage = 1;
    this.applySort();
    this.updatePagination();
  }

  /** ================= SORT ================= **/
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

    this.filteredList.sort((a: any, b: any) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      // Numeric sort
      if (typeof valA === 'number' && typeof valB === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // String sort
      valA = valA ? valA.toString().toLowerCase() : '';
      valB = valB ? valB.toString().toLowerCase() : '';
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /** ================= PAGINATION ================= **/
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredList.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedList = this.filteredList.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePagination(); }
  }

  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.updatePagination(); }
  }

  /** ================= NAVBAR & LOGOUT ================= **/
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
        Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
          .then(() => this.router.navigate(['/admin-login']));
      }
    });
  }

}
