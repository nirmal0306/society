import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';

@Component({
  selector: 'app-manage-visitor',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule,ResidentNavComponent],
  templateUrl: './manage-visitor.component.html',
  styleUrls: ['./manage-visitor.component.css']
})
export class ManageVisitorComponent implements OnInit {

  visitors: any[] = [];
  pagedVisitors: any[] = [];
  loading = true;

  currentPage = 1;
  pageSize = 4;
  totalPages = 1;

  API_URL = "http://localhost:5000/api/visitors";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem("email");
    if (!email) { this.router.navigate(['/login']); return; }
    this.loadVisitors();
  }

  loadVisitors() {
    const email = localStorage.getItem("email");


    this.loading = true;
    this.http.get<any[]>(`${this.API_URL}/resident/${email}`).subscribe({
      next: res => {
        this.visitors = res;
        this.totalPages = Math.ceil(this.visitors.length / this.pageSize);
        this.setPage(1);
        this.loading = false;
      },
      error: () => {
        Swal.fire("Error", "Failed to load visitors", "error");
        this.loading = false;
      }
    });
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedVisitors = this.visitors.slice(start, end);
  }

  approveVisitor(id: string) {
    this.http.put(`${this.API_URL}/approve/${id}`, {}).subscribe({
      next: () => {
        Swal.fire("Approved", "Visitor entry allowed", "success");
        this.loadVisitors();
      },
      error: () => { Swal.fire("Error", "Approval failed", "error"); }
    });
  }

  rejectVisitor(id: string) {
    this.http.put(`${this.API_URL}/reject/${id}`, {}).subscribe({
      next: () => {
        Swal.fire("Rejected", "Visitor rejected", "error");
        this.loadVisitors();
      },
      error: () => { Swal.fire("Error", "Reject failed", "error"); }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'status pending';
      case 'Accepted': return 'status approved';
      case 'Rejected': return 'status rejected';
      default: return 'status';
    }
  }
}
