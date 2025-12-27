import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2'; // <-- Import SweetAlert

interface Visitor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  purpose: string;
  visitedResident: string;
  photo: string;
}

@Component({
  selector: 'app-list-visitors',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './list-visitors.component.html',
  styleUrls: ['./list-visitors.component.css']
})
export class ListVisitorsComponent implements OnInit {

  visitors: Visitor[] = [];
  loading = false;

  private API_URL = 'http://localhost:5000/api/visitors'; // Your visitor API

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getVisitors();
  }

  getVisitors() {
    this.loading = true;
    this.http.get<Visitor[]>(this.API_URL).subscribe({
      next: (res) => {
        this.visitors = res;
        this.loading = false;
        if (!res.length) {
          Swal.fire({
            icon: 'info',
            title: 'No Visitors',
            text: 'No visitors found in the system.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch visitors!',
        });
      }
    });
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
