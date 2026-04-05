import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../nav/admin-nav/admin-nav.component';
@Component({
  selector: 'app-admin-about',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,AdminNavComponent],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.css'
})
export class AdminAboutComponent {

constructor(private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
  }
}
