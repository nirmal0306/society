import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../nav/admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AdminNavComponent],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {

  constructor(private router: Router) {}

  name = localStorage.getItem('name') || 'Admin';
  email = localStorage.getItem('email') || '';

  ngOnInit() {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
  }
}
