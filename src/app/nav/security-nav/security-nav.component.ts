import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-security-nav',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './security-nav.component.html',
  styleUrl: './security-nav.component.css'
})
export class SecurityNavComponent {
  constructor(private router: Router) {}

  menuOpen = false;
  servicesOpen = false;
  visitorsOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleServices() {
    this.servicesOpen = !this.servicesOpen;
  }

  toggleVisitors() {
    this.visitorsOpen = !this.visitorsOpen;
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
