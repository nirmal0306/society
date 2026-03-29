import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-manage-complaints',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule],
  templateUrl: './manage-complaints.component.html',
  styleUrl: './manage-complaints.component.css'
})
export class ManageComplaintsComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router) {}

  API_URL = "http://localhost:5000/api/complaints";

  complaints: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadComplaints();
  }

  /* ================= LOAD ALL ================= */
  loadComplaints() {
    this.http.get<any[]>(this.API_URL).subscribe({
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

  /* ================= RESOLVE ================= */
  resolveComplaint(c: any) {

    Swal.fire({
      title: 'Resolve Complaint?',
      text: "Mark this complaint as resolved?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Resolve'
    }).then((result) => {

      if (result.isConfirmed) {

        this.http.put(`${this.API_URL}/${c._id}`, {
          status: "Resolved",
          category: c.category
        }).subscribe({
          next: (res: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Resolved',
              text: res.complaint.responseMessage
            });

            this.loadComplaints();
          },
          error: () => {
            Swal.fire("Error", "Failed to update", "error");
          }
        });

      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Resolved': return 'resolved';
      default: return '';
    }
  }
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
          this.router.navigate(['/admin-login']);
        });
      }
    });
  }

}
