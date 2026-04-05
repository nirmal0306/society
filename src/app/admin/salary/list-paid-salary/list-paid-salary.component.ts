import { Router,RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';


interface Salary {
  name: string;
  email: string;
  months: string[];
  amount: number;
  method: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-list-paid-salary',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule,RouterModule, AdminNavComponent],
  templateUrl: './list-paid-salary.component.html',
  styleUrls: ['./list-paid-salary.component.css']
})
export class ListPaidSalaryComponent implements OnInit {

  API = "http://localhost:5000/api/salary";

  salaries: Salary[] = [];
  filtered: Salary[] = [];
  paginated: Salary[] = [];

  searchText = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {

    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }

    this.loadAll();
  }

  /* LOAD DATA */
  loadAll() {
    this.http.get<Salary[]>(`${this.API}/all`).subscribe({
      next: (res) => {
        this.salaries = res || [];
        this.applyFilter();
      },
      error: () => alert("Failed to load salary data")
    });
  }

  /* FILTER */
  applyFilter() {
    const s = this.searchText.toLowerCase();

    this.filtered = this.salaries.filter(x =>
      x.name.toLowerCase().includes(s) ||
      x.email.toLowerCase().includes(s) ||
      x.months.some(m => m.toLowerCase().includes(s))  // <-- fix here
    );

    this.currentPage = 1;
    this.applySort();
    this.updatePagination();
  }

  /* SORT */
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

      if (typeof valA === 'number') {
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      valA = valA?.toString().toLowerCase() || '';
      valB = valB?.toString().toLowerCase() || '';

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
