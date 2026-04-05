import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

@Component({
  selector: 'app-edit-notice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, AdminNavComponent],
  templateUrl: './edit-notice.component.html',
  styleUrls: ['./edit-notice.component.css']
})
export class EditNoticeComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  API_URL = 'http://localhost:5000/api/notices';

  notice: any = {
    _id: '',
    title: '',
    description: '',
    date: '',
    type: 'General'
  };

  /* ================= LOAD NOTICE ================= */
  ngOnInit() {

    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      Swal.fire('Error', 'Invalid notice ID', 'error');
      this.router.navigate(['/list-notices']);
      return;
    }

    this.http.get<any>(`${this.API_URL}/${id}`)
      .subscribe({
        next: (res) => {
          this.notice = res.data || res; // support multiple formats
        },
        error: () => {
          Swal.fire('Error', 'Notice not found', 'error')
            .then(() => this.router.navigate(['/list-notices']));
        }
      });
  }

  /* ================= UPDATE ================= */
  updateNotice() {

    const { title, description, date, type } = this.notice;

    if (!title || !description || !date || !type) {
      Swal.fire('Validation Error', 'All fields are required', 'warning');
      return;
    }

    this.http.put(`${this.API_URL}/${this.notice._id}`, this.notice)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Notice Updated',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/list-notices']);
          });
        },
        error: () => {
          Swal.fire('Error', 'Failed to update notice', 'error');
        }
      });
  }
}
