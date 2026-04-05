import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SecurityNavComponent } from '../../nav/security-nav/security-nav.component';

@Component({
  selector: 'app-security-about',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,SecurityNavComponent],
  templateUrl: './security-about.component.html',
  styleUrl: './security-about.component.css'
})
export class SecurityAboutComponent {

  constructor(private router: Router) {}
  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']); // redirect if not logged in
      return;
    }
  }
}
