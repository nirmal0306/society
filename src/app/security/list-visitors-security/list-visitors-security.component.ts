import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SecurityNavComponent } from '../../nav/security-nav/security-nav.component';

interface Visitor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  block: string;
  flat: string;
  purpose: string;
  photo: string;
  status: string;
  entryTime: string;
  exitStatus: string;
}

@Component({
  selector: 'app-list-visitors-security',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    SecurityNavComponent
  ],
  templateUrl: './list-visitors-security.component.html',
  styleUrls: ['./list-visitors-security.component.css']
})
export class ListVisitorsSecurityComponent implements OnInit {

  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  paginatedVisitors: Visitor[] = [];

  loading = false;

  searchText = '';

  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 1;

  API_URL = "http://localhost:5000/api/visitors";

  constructor(private http: HttpClient, private router: Router) {}

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']); // redirect if not logged in
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
        this.filteredVisitors = res;

        this.calculatePagination();

        this.loading = false;
      },

      error: () => {
        this.loading = false;
        Swal.fire("Error", "Failed to fetch visitors", "error");
      }

    });

  }

  /* ================= PAGINATION ================= */

  calculatePagination() {

    this.totalPages = Math.ceil(
      this.filteredVisitors.length / this.recordsPerPage
    );

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

  /* ================= FILTER ================= */

  applyFilter() {

    const search = this.searchText.toLowerCase();

    this.filteredVisitors = this.visitors.filter(v =>
      v.name.toLowerCase().includes(search) ||
      v.email.toLowerCase().includes(search) ||
      v.mobile.includes(search) ||
      v.flat.toLowerCase().includes(search) ||
      v.purpose.toLowerCase().includes(search) ||
      v.status.toLowerCase().includes(search) ||
      v.exitStatus.toLowerCase().includes(search)
    );

    this.currentPage = 1;

    this.calculatePagination();

  }

  /* ================= EXIT VISITOR ================= */
  sortData(column: string){

    if(this.sortColumn === column){
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else{
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredVisitors.sort((a:any,b:any)=>{

    const valueA = a[column] || '';
    const valueB = b[column] || '';

    if(this.sortDirection === 'asc'){
      return valueA > valueB ? 1 : -1;
    }else{
      return valueA < valueB ? 1 : -1;
    }

    });

    this.calculatePagination();

    }

    getSortIcon(column:string){

      if(this.sortColumn !== column){
        return '⇅';
      }

      return this.sortDirection === 'asc' ? '▲' : '▼';

      }

  exitVisitor(id: string) {

    this.http.put(`${this.API_URL}/exit/${id}`, {}).subscribe({

      next: () => {
        Swal.fire("Exit recorded", "", "success");
        this.getVisitors();
      }

    });

  }
}
