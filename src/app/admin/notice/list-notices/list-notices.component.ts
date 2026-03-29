import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Notice {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: string;
}

@Component({
  selector: 'app-list-notices',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './list-notices.component.html',
  styleUrls: ['./list-notices.component.css']
})
export class ListNoticesComponent implements OnInit {

  notices: Notice[] = [];
  filteredNotices: Notice[] = [];
  paginatedNotices: Notice[] = [];
  loading = false;

  /* SEARCH */
  searchText = '';

  /* SORT */
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortFieldClicked = false;

  /* PAGINATION */
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  private API_URL = 'http://localhost:5000/api/notices';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getNotices();
  }

  /* ================= NAVBAR ================= */
  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  noticeOpen = false;
  maintenanceOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleServices() { this.servicesOpen = !this.servicesOpen; }
  toggleResidents() { this.residentsOpen = !this.residentsOpen; }
  toggleSecurity() { this.securityOpen = !this.securityOpen; }
  toggleVisitors() { this.visitorsOpen = !this.visitorsOpen; }
  toggleEvent() { this.eventOpen = !this.eventOpen; }
  toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }
  toggleNotice() { this.noticeOpen = !this.noticeOpen; }

  /* ================= GET ================= */
  getNotices() {
    this.loading = true;
    this.http.get<any>(this.API_URL).subscribe({
      next: (res) => {
        this.notices = res.data || res.notices || res || [];
        this.loading = false;
        this.applyFilter();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load notices', 'error');
      }
    });
  }

  /* ================= DELETE ================= */
  deleteNotice(id: string) {
    Swal.fire({
      title: 'Delete Notice?',
      text: 'This notice will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Notice deleted successfully', 'success');
            this.notices = this.notices.filter(n => n._id !== id);
            this.applyFilter();
          },
          error: () => Swal.fire('Error', 'Failed to delete notice', 'error')
        });
      }
    });
  }

  editNotice(id: string) {
    this.router.navigate(['/edit-notice', id]);
  }

  /* ================= SEARCH ================= */
  applyFilter() {
    const value = this.searchText.toLowerCase();

    this.filteredNotices = this.notices.filter(n =>
      n.title.toLowerCase().includes(value) ||
      n.type.toLowerCase().includes(value) ||
      n.date.includes(value)
    );

    this.currentPage = 1;

    if (this.sortFieldClicked) {
      this.applySorting();
    } else {
      this.updatePagination();
    }
  }

  /* ================= SORT ================= */
  sortData(column: string) {
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
      this.sortDirection = 'asc';
    }

    this.sortFieldClicked = true;
    this.applySorting();
  }

  applySorting() {
    this.filteredNotices.sort((a: any, b: any) => {
      let A = (a[this.sortField] || '').toString().toLowerCase();
      let B = (b[this.sortField] || '').toString().toLowerCase();

      if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  getSortIcon(column: string) {
    if (!this.sortFieldClicked || this.sortField !== column) return '⇅';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  /* ================= PAGINATION ================= */
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredNotices.length / this.itemsPerPage) || 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedNotices = this.filteredNotices.slice(start, end);
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

  /* ================= LOGOUT ================= */
  logout() {
    localStorage.clear();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      timer: 1200,
      showConfirmButton: false
    }).then(() => this.router.navigate(['/admin-login']));
  }
}
