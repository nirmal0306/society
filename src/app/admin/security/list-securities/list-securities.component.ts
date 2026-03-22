import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Security {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  shift: string;
  photo: string;
}

@Component({
  selector: 'app-list-securities',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule], // FormsModule for ngModel
  templateUrl: './list-securities.component.html',
  styleUrls: ['./list-securities.component.css']
})
export class ListSecuritiesComponent implements OnInit {

  securities: Security[] = [];
  filteredSecurities: Security[] = [];
  paginatedSecurities: Security[] = [];
  loading = false;

  searchText = '';
  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private API_URL = 'http://localhost:5000/api/security';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getSecurities();
  }

  /* ================= GET SECURITIES ================= */
  getSecurities() {
    this.loading = true;
    this.http.get<Security[]>(this.API_URL).subscribe({
      next: (res) => {
        this.securities = res;
        this.loading = false;
        this.applyFilter(); // initialize filtered + paginated
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to fetch security staff', 'error');
      }
    });
  }

  /* ================= FILTER ================= */
  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredSecurities = this.securities.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search) ||
      s.mobile.includes(search) ||
      s.shift.toLowerCase().includes(search)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  /* ================= PAGINATION ================= */
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredSecurities.length / this.recordsPerPage);
    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    this.paginatedSecurities = this.filteredSecurities.slice(start, end);
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

  /* ================= SORTING ================= */
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredSecurities.sort((a: any, b: any) => {
      const valA = a[column] || '';
      const valB = b[column] || '';

      if (this.sortDirection === 'asc') return valA > valB ? 1 : -1;
      else return valA < valB ? 1 : -1;
    });

    this.calculatePagination();
  }

  getSortIcon(column: string) {
    if (this.sortColumn !== column) return '⇅';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  /* ================= ACTIONS ================= */
  editSecurity(id: string) {
    this.router.navigate(['/edit-security', id]);
  }

  deleteSecurity(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this security staff!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Security staff has been deleted.', 'success');
            this.securities = this.securities.filter(s => s._id !== id);
            this.applyFilter();
          },
          error: () => Swal.fire('Error', 'Failed to delete security staff', 'error')
        });
      }
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
    }).then(() => this.router.navigate(['/admin-login']));
  }

  /* ================= NAVBAR ================= */
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

}
