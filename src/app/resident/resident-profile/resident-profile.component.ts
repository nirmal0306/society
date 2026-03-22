import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resident-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './resident-profile.component.html',
  styleUrls: ['./resident-profile.component.css']
})
export class ResidentProfileComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) {}

  BASE_URL = "http://localhost:5000/api/residents";

  name = "";
  email = "";
  mobile = "";
  flats: any[] = [];
  photo = "";


  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any>(`${this.BASE_URL}/profile/${email}`)
      .subscribe({
        next: (res) => {
          this.name = res.name;
          this.email = res.email;
          this.mobile = res.mobile;
          this.flats = res.flats;
          this.photo = res.photo;
        },
        error: () => {
          Swal.fire("Error", "Failed to load profile", "error");
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
