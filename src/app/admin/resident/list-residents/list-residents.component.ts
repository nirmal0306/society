import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Resident {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  block: string;
  flat: string;
  photo: string;
}

@Component({
  selector: 'app-list-residents',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './list-residents.component.html',
  styleUrls: ['./list-residents.component.css']
})
export class ListResidentsComponent implements OnInit {

  residents: Resident[] = [];
  loading = false;

  private API_URL = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getResidents();
  }

  getResidents() {
    this.loading = true;
    this.http.get<Resident[]>(this.API_URL).subscribe({
      next: (res) => {
        this.residents = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Error fetching residents');
      }
    });
  }

  editResident(id: string) {
    this.router.navigate(['/edit-resident', id]);
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
