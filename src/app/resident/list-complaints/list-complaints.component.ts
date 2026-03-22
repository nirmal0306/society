import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-complaints',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './list-complaints.component.html',
  styleUrls: ['./list-complaints.component.css']
})
export class ListComplaintsComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  API_URL = "http://localhost:5000/api/complaints";

  complaints: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadComplaints();
  }

  loadComplaints() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

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

  menuOpen = false;
  servicesOpen = false;
  complaintsOpen = false;
  maintenanceOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleServices() {
    this.servicesOpen = !this.servicesOpen;
  }

  toggleComplaints() {
    this.complaintsOpen = !this.complaintsOpen;
  }

  toggleMaintenance() {
    this.maintenanceOpen = !this.maintenanceOpen;
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
