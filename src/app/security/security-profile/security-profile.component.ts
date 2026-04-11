import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SecurityNavComponent } from '../../nav/security-nav/security-nav.component';
import { API_URL } from '../../app.config';
@Component({
  selector: 'app-security-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule,SecurityNavComponent],
  templateUrl: './security-profile.component.html',
  styleUrls: ['./security-profile.component.css']
})
export class SecurityProfileComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) {}

  name = "";
  email = "";
  mobile = "";
  shift = "";
  photo = "";

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']); // redirect if not logged in
      return;
    }
    this.loadProfile();
  }

  loadProfile() {

    const email = localStorage.getItem("email");

    this.http.get<any>(`${API_URL}/api/security/profile/${email}`)
      .subscribe({
        next: (res) => {
          this.name = res.name;
          this.email = res.email;
          this.mobile = res.mobile;
          this.shift = res.shift;
          this.photo = res.photo;
        },
        error: () => {
          Swal.fire("Error", "Failed to load profile", "error");
        }
      });

  }
}
