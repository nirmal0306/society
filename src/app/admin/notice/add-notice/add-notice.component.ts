import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';
import { API_URL } from '../../../app.config';

@Component({
  selector: 'app-add-notice',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule,AdminNavComponent],
  templateUrl: './add-notice.component.html',
  styleUrls: ['./add-notice.component.css']
})
export class AddNoticeComponent {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(){
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
  }

    /* ================= NOTICE MODEL ================= */
  notice = {
    title: '',
    description: '',
    date: '',
    type: 'General'
  };

  /* ================= ADD NOTICE ================= */
  addNotice() {

    const { title, description, date, type } = this.notice;

    if (!title || !description || !date || !type) {
      Swal.fire('Validation Error', 'All fields are required', 'warning');
      return;
    }

    this.http.post(`${API_URL}/api/notices`, this.notice)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Notice Created',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/list-notices']);
          });
        },
        error: () => {
          Swal.fire('Error', 'Failed to create notice', 'error');
        }
      });
  }
}
