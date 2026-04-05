import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SecurityNavComponent } from '../../nav/security-nav/security-nav.component';
import Swal from 'sweetalert2';

interface Salary {
  months: string[];
  amount: number;
  method: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-manage-salary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    SecurityNavComponent
  ],
  templateUrl: './manage-salary.component.html',
  styleUrls: ['./manage-salary.component.css']
})
export class ManageSalaryComponent implements OnInit {

  API = 'http://localhost:5000/api/salary';
  securityId: string = '';
  salaries: Salary[] = [];
  filtered: Salary[] = [];
  paginated: Salary[] = [];

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
  const email = localStorage.getItem('email');

  if (!email) {
    this.router.navigate(['/login']);
    return;
  }

  // Step 1: Fetch security user info by email
  this.http.get<any>(`http://localhost:5000/api/security/profile/${email}`)
    .subscribe({
      next: (res) => {
        // Assuming backend returns { _id, name, email, ... }
        this.securityId = res._id;

        // Step 2: Fetch salary using securityId
        this.loadSalary();
      },
      error: () => {
        Swal.fire("Error", "Failed to load security profile", "error");
        this.router.navigate(['/login']);
      }
    });
}

// Load salary after getting securityId
loadSalary() {
  this.http.get<Salary[]>(`${this.API}/${this.securityId}`).subscribe({
    next: (res) => {
      this.salaries = res || [];
      this.applyFilter();
    },
    error: () => Swal.fire("Error", "Failed to load salary data", "error")
  });
}

  /* ================= SEARCH FILTER ================= */
  applyFilter() {
    const s = this.searchText.toLowerCase();
    this.filtered = this.salaries.filter(x =>
      x.months.some(m => m.toLowerCase().includes(s)) ||
      x.amount.toString().includes(s) ||
      x.method.toLowerCase().includes(s)
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

    this.filtered.sort((a: any, b: any) => {
      let valA: any = a[column];
      let valB: any = b[column];

      // If column is months (array), sort by first month alphabetically
      if (Array.isArray(valA)) valA = valA[0] || '';
      if (Array.isArray(valB)) valB = valB[0] || '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.calculatePagination();
  }

  /* ================= PAGINATION ================= */
  calculatePagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    this.paginated = this.filtered.slice(
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
