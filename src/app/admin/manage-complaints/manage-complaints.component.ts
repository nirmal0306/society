import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../../nav/admin-nav/admin-nav.component';
@Component({
  selector: 'app-manage-complaints',
  standalone: true,
  imports: [CommonModule, HttpClientModule,RouterModule,AdminNavComponent],
  templateUrl: './manage-complaints.component.html',
  styleUrl: './manage-complaints.component.css'
})
export class ManageComplaintsComponent implements OnInit {

  constructor(private http: HttpClient,private router: Router) {}

  API_URL = "http://localhost:5000/api/complaints";

  complaints: any[] = [];
  loading = true;

  ngOnInit() {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
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
}
