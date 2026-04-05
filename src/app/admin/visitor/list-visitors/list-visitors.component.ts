import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

interface Visitor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  purpose: string;
  residentName: string;
  addedBy: string;
  photo: string;
}

@Component({
  selector: 'app-list-visitors',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,AdminNavComponent],
  templateUrl: './list-visitors.component.html',
  styleUrls: ['./list-visitors.component.css']
})
export class ListVisitorsComponent implements OnInit {

  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  paginatedVisitors: Visitor[] = [];
  loading = false;

  searchText = '';
  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 1;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private API_URL = 'http://localhost:5000/api/visitors';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.getVisitors();
  }

  /* ================= GET VISITORS ================= */
  getVisitors() {
    this.loading = true;
    this.http.get<Visitor[]>(this.API_URL).subscribe({
      next: (res) => {
        this.visitors = res;
        this.loading = false;
        this.applyFilter(); // Apply initial filter + pagination
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch visitors!',
        });
      }
    });
  }

  /* ================= FILTER ================= */
  applyFilter() {
    const search = this.searchText.toLowerCase();

    this.filteredVisitors = this.visitors.filter(v =>
      v.name.toLowerCase().includes(search) ||
      v.email.toLowerCase().includes(search) ||
      v.mobile.includes(search) ||
      v.purpose.toLowerCase().includes(search) ||
      v.residentName.toLowerCase().includes(search) ||
      v.addedBy.toLowerCase().includes(search)
    );

    this.currentPage = 1;
    this.applySort(); // sort before pagination
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

    this.filteredVisitors.sort((a: any, b: any) => {
      const valA = (a[this.sortColumn] || '').toString().toLowerCase();
      const valB = (b[this.sortColumn] || '').toString().toLowerCase();

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
    this.totalPages = Math.ceil(this.filteredVisitors.length / this.recordsPerPage) || 1;

    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;

    this.paginatedVisitors = this.filteredVisitors.slice(start, end);
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
