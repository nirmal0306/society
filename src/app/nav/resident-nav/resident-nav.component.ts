import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resident-nav',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resident-nav.component.html',
  styleUrl: './resident-nav.component.css'
})
export class ResidentNavComponent {
constructor(private router: Router) {}
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
        }).then(() => { this.router.navigate(['/login']); });
      }
    });
  }
}
