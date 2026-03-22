import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Resident {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  flats: { block: string; flat: string }[];
  photo: string;
}

@Component({
  selector: 'app-list-residents',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './list-residents.component.html',
  styleUrls: ['./list-residents.component.css']
})
export class ListResidentsComponent implements OnInit {

  residents: Resident[] = [];
  filteredResidents: Resident[] = [];
  paginatedResidents: Resident[] = [];
  loading = false;

  searchText = '';
  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private API_URL = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getResidents();
  }

  /* ================= GET RESIDENTS ================= */
  getResidents() {
    this.loading = true;
    this.http.get<Resident[]>(this.API_URL).subscribe({
      next: (res) => {
        this.residents = res;
        this.loading = false;
        this.applyFilter();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to fetch residents', 'error');
      }
    });
  }

  /* ================= FILTER ================= */
  applyFilter() {
    const search = this.searchText.toLowerCase();
    this.filteredResidents = this.residents.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.email.toLowerCase().includes(search) ||
      r.mobile.includes(search) ||
      r.flats.some(f => (f.block + f.flat).toLowerCase().includes(search))
    );

    this.currentPage = 1;
    this.applySort();
    this.calculatePagination();
  }

  /* ================= SORT ================= */
  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySort();
    this.calculatePagination();
  }

  applySort() {
    if (!this.sortColumn) return;

    this.filteredResidents.sort((a: any, b: any) => {
      let valA: any = '';
      let valB: any = '';

      if (this.sortColumn === 'flats') {
        valA = a.flats.map((f: { block: string; flat: string }) => f.block + f.flat).join(', ').toLowerCase();
        valB = b.flats.map((f: { block: string; flat: string }) => f.block + f.flat).join(', ').toLowerCase();
      } else {
        valA = (a[this.sortColumn] || '').toString().toLowerCase();
        valB = (b[this.sortColumn] || '').toString().toLowerCase();
      }

      if (this.sortDirection === 'asc') return valA > valB ? 1 : valA < valB ? -1 : 0;
      else return valA < valB ? 1 : valA > valB ? -1 : 0;
    });
  }

  getSortIcon(column: string) {
    if (this.sortColumn !== column) return '⇅';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  /* ================= PAGINATION ================= */
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredResidents.length / this.recordsPerPage) || 1;

    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;

    this.paginatedResidents = this.filteredResidents.slice(start, end);
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

  /* ================= EDIT / DELETE ================= */
  editResident(id: string) {
    this.router.navigate(['/edit-resident', id]);
  }

  deleteResident(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the resident!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Resident has been deleted.', 'success');
            this.residents = this.residents.filter(r => r._id !== id);
            this.applyFilter();
          },
          error: () => Swal.fire('Error', 'Failed to delete resident', 'error')
        });
      }
    });
  }

  /* ================= LOGOUT ================= */
  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Do you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/admin-login']));
      }
    });
  }

  /* ================= NAVBAR TOGGLERS ================= */
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
