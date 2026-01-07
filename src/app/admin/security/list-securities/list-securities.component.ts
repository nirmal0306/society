import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Security {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  shift: string;
  photo: string;
}

@Component({
  selector: 'app-list-securities',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './list-securities.component.html',
  styleUrls: ['./list-securities.component.css']
})
export class ListSecuritiesComponent implements OnInit {

  securities: Security[] = [];
  loading = false;

  private API_URL = 'http://localhost:5000/api/security';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getSecurities();
  }

  getSecurities() {
    this.loading = true;
    this.http.get<Security[]>(this.API_URL).subscribe({
      next: (res) => {
        this.securities = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'Failed to fetch security staff', 'error');
      }
    });
  }

  editSecurity(id: string) {
    this.router.navigate(['/edit-security', id]);
  }

  deleteSecurity(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this security staff!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Security staff has been deleted.', 'success');
            this.securities = this.securities.filter(s => s._id !== id);
          },
          error: () => Swal.fire('Error', 'Failed to delete security staff', 'error')
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
    }).then(() => this.router.navigate(['/admin-login']));
  }
}
