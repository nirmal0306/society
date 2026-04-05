import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

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
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule,AdminNavComponent],
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
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
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
}
