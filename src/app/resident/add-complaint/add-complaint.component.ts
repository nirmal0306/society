import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.css']
})
export class AddComplaintComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) {}

  RESIDENT_API = "http://localhost:5000/api/residents";
  COMPLAINT_API = "http://localhost:5000/api/complaints";

  name = "";
  email = "";
  mobile = "";
  flats: any[] = [];

  complaint = {
    subject: '',
    category: '',
    description: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  /* ================= LOAD RESIDENT PROFILE ================= */
  loadProfile() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
      .subscribe({
        next: (res) => {
          this.name = res.name;
          this.email = res.email;
          this.mobile = res.mobile;
          this.flats = res.flats;
        },
        error: () => {
          Swal.fire("Error", "Failed to load profile", "error");
        }
      });
  }

  /* ================= SUBMIT COMPLAINT ================= */
  submitComplaint() {

    if (!this.complaint.subject ||
        !this.complaint.category ||
        !this.complaint.description) {

      Swal.fire('Validation Error', 'All fields are required', 'warning');
      return;
    }

    if (this.complaint.description.length < 10) {
      Swal.fire('Validation Error', 'Description too short', 'warning');
      return;
    }

    const complaintData = {
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      flats: this.flats,
      subject: this.complaint.subject,
      category: this.complaint.category,
      description: this.complaint.description,
      status: 'Pending'
    };

    Swal.fire({
      title: 'Submitting Complaint...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(this.COMPLAINT_API, complaintData)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Complaint Submitted',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.complaint = {
              subject: '',
              category: '',
              description: ''
            };
            this.router.navigate(['/list-complaints']);
          });
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'Failed to submit', 'error');
        }
      });
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
