import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../nav/admin-nav/admin-nav.component';

@Component({
  selector: 'app-manage-leave-application',
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,AdminNavComponent],
  templateUrl: './manage-leave-application.component.html',
  styleUrl: './manage-leave-application.component.css'
})
export class ManageLeaveApplicationComponent {

  constructor(private http: HttpClient, private router: Router) {}
/* ================= LOGOUT ================= */
LEAVE_API = "http://localhost:5000/api/leaves";

leaves: any[] = [];

ngOnInit() {
  const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
  this.loadLeaves();
}

loadLeaves() {
  this.http.get<any[]>(this.LEAVE_API).subscribe(res => {
    this.leaves = res;
  });
}

updateStatus(l: any, status: string) {

  if (!l.adminMessage || l.adminMessage.trim() === "") {
    Swal.fire("Error", "Please enter response message", "warning");
    return;
  }

  this.http.put(`${this.LEAVE_API}/${l._id}`, {
    status: status,
    responseMessage: l.adminMessage   // ✅ SEND MESSAGE
  }).subscribe({
    next: () => {
      Swal.fire("Success", `Leave ${status}`, "success");
      this.loadLeaves();
    },
    error: () => {
      Swal.fire("Error", "Failed to update", "error");
    }
  });
}
}
