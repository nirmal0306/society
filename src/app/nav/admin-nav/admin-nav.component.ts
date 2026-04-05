

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {

  constructor(private router: Router) {}



  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  maintenanceOpen = false;
  noticeOpen = false;
  salaryOpen = false;

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

  toggleSalary(){
    this.salaryOpen = !this.salaryOpen;
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
