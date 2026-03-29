import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-notice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-notice.component.html',
  styleUrls: ['./edit-notice.component.css']
})
export class EditNoticeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  API_URL = 'http://localhost:5000/api/notices';

  notice: any = {
    _id: '',
    title: '',
    description: '',
    date: '',
    type: 'General'
  };

  /* ================= LOAD NOTICE ================= */
  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      Swal.fire('Error', 'Invalid notice ID', 'error');
      this.router.navigate(['/list-notices']);
      return;
    }

    this.http.get<any>(`${this.API_URL}/${id}`)
      .subscribe({
        next: (res) => {
          this.notice = res.data || res; // support multiple formats
        },
        error: () => {
          Swal.fire('Error', 'Notice not found', 'error')
            .then(() => this.router.navigate(['/list-notices']));
        }
      });
  }

  /* ================= NAVBAR ================= */
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

  /* ================= UPDATE ================= */
  updateNotice() {

    const { title, description, date, type } = this.notice;

    if (!title || !description || !date || !type) {
      Swal.fire('Validation Error', 'All fields are required', 'warning');
      return;
    }

    this.http.put(`${this.API_URL}/${this.notice._id}`, this.notice)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Notice Updated',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/list-notices']);
          });
        },
        error: () => {
          Swal.fire('Error', 'Failed to update notice', 'error');
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
