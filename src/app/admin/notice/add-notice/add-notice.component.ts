import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-notice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent {

  constructor(private http: HttpClient, private router: Router) {}

  NOTICE_API = "http://localhost:5000/api/notices";

  /* ================= NOTICE MODEL ================= */
  notice = {
    title: '',
    description: '',
    date: '',
    type: 'General'
  };

  /* ================= NAVBAR STATES ================= */
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

  /* ================= ADD NOTICE ================= */
  addNotice() {

    const { title, description, date, type } = this.notice;

    if (!title || !description || !date || !type) {
      Swal.fire('Validation Error', 'All fields are required', 'warning');
      return;
    }

    this.http.post(this.NOTICE_API, this.notice)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Notice Created',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/list-notices']);
          });
        },
        error: () => {
          Swal.fire('Error', 'Failed to create notice', 'error');
        }
      });
  }

  /* ================= LOGOUT ================= */
  logout() {
    Swal.fire({
      title: 'Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          timer: 1200,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/admin-login']));
      }
    });
  }
}
