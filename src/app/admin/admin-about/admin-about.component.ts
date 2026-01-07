import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-about',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.css'
})
export class AdminAboutComponent {

constructor(private router: Router) {}


  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleServices() {
    this.servicesOpen = !this.servicesOpen;
  }

  toggleResidents() {
    this.residentsOpen = !this.residentsOpen;
  }

  toggleSecurity() {
    this.securityOpen = !this.securityOpen;
  }

  toggleVisitors() {
  this.visitorsOpen = !this.visitorsOpen;
  }

logout() {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin-login']);
        });
      }

}
