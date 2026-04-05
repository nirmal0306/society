import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { SecurityNavComponent } from '../../nav/security-nav/security-nav.component';

@Component({
  selector: 'app-leave-application',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,RouterModule,SecurityNavComponent],
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
})
export class LeaveApplicationComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  SECURITY_API = "http://localhost:5000/api/security";
  LEAVE_API = "http://localhost:5000/api/leaves";

  // ✅ REQUIRED VARIABLES (fix error)
  name: string = "";
  email: string = "";

  leave = {
    fromDate: '',
    toDate: '',
    reason: ''
  };
  leaves: any[] = [];

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']); // redirect if not logged in
      return;
    }
    this.loadProfile();
  }

  loadMyLeaves() {

  if (!this.email) return;

  this.http.get<any[]>(`${this.LEAVE_API}/email/${this.email}`)
    .subscribe({
      next: (res) => {
        this.leaves = res;
      },
      error: () => {
        Swal.fire("Error", "Failed to load leave history", "error");
      }
    });
}

  /* ================= LOAD SECURITY PROFILE ================= */
  loadProfile() {

    const email = localStorage.getItem("email"); // only for identification

    if (!email) {
      Swal.fire("Error", "Please login again", "error");
      return;
    }

    this.http.get<any>(`${this.SECURITY_API}/profile/${email}`)
      .subscribe({
        next: (res) => {
          this.name = res.name;
          this.email = res.email;
          this.loadMyLeaves();
        },
        error: () => {
          Swal.fire("Error", "Failed to load profile", "error");
        }
      });
  }


  /* ================= APPLY LEAVE ================= */
  applyLeave() {

    if (!this.leave.fromDate || !this.leave.toDate || !this.leave.reason) {
      Swal.fire("Validation Error", "All fields are required", "warning");
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      fromDate: this.leave.fromDate,
      toDate: this.leave.toDate,
      reason: this.leave.reason
    };

    Swal.fire({
      title: 'Applying Leave...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(this.LEAVE_API, data)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Leave Applied',
            timer: 1500,
            showConfirmButton: false
          });

          this.leave = {
            fromDate: '',
            toDate: '',
            reason: ''
          };
           this.loadMyLeaves(); // ✅ refresh list
        },
        error: () => {
          Swal.fire("Error", "Failed to apply leave", "error");
        }
      });
  }
}
