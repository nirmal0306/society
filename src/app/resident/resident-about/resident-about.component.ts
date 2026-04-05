import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';
@Component({
  selector: 'app-resident-about',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,ResidentNavComponent],
  templateUrl: './resident-about.component.html',
  styleUrl: './resident-about.component.css'
})
export class ResidentAboutComponent {

  constructor(private router: Router) {}
    ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
  }
}

