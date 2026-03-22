import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(private router: Router) {}

  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  maintenanceOpen = false;
  noticeOpen = false;

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

  toggleEvent(){
    this.eventOpen = !this.eventOpen;
  }

  toggleMaintenance(){
    this.maintenanceOpen = !this.maintenanceOpen;
  }

  toggleNotice(){
    this.noticeOpen = !this.noticeOpen;
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
           this.router.navigate(['/admin-login']);
         });
       }
     });
   }
 }
 
