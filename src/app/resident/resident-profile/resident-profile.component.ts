import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';
import { API_URL } from '../../app.config';
@Component({
  selector: 'app-resident-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule,ResidentNavComponent],
  templateUrl: './resident-profile.component.html',
  styleUrls: ['./resident-profile.component.css']
})
export class ResidentProfileComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) {}

  name = "";
  email = "";
  mobile = "";
  flats: any[] = [];
  photo = "";


  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile() {
    const email = localStorage.getItem("email");

    this.http.get<any>(`${API_URL}/api/residents/profile/${email}`)
      .subscribe({
        next: (res) => {
          this.name = res.name;
          this.email = res.email;
          this.mobile = res.mobile;
          this.flats = res.flats;
          this.photo = res.photo;
        },
        error: () => {
          Swal.fire("Error", "Failed to load profile", "error");
        }
      });
  }
}
