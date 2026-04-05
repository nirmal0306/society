import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule,ResidentNavComponent],
  templateUrl: './list-complaints.component.html',
  styleUrls: ['./list-complaints.component.css']
})
export class ListComplaintsComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  API_URL = "http://localhost:5000/api/complaints";

  complaints: any[] = [];
  loading = true;

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadComplaints();
  }

  loadComplaints() {
    const email = localStorage.getItem("email");


    this.http.get<any[]>(`${this.API_URL}/email/${email}`)
      .subscribe({
        next: (res) => {
          this.complaints = res;
          this.loading = false;
        },
        error: () => {
          Swal.fire("Error", "Failed to load complaints", "error");
          this.loading = false;
        }
      });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'status pending';
      case 'In Progress': return 'status progress';
      case 'Resolved': return 'status resolved';
      default: return 'status';
    }
  }
}
