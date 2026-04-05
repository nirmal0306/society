import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPaymentModalComponent } from '../../admin-payment-modal/admin-payment-modal.component';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

interface SecurityUser {
  _id: string;
  name: string;
  email: string;
}

interface PaidStatus {
  securityId: string;
  paidMonths: string[];
}

@Component({
  selector: 'app-pay-salary',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminPaymentModalComponent, RouterModule, AdminNavComponent],
  templateUrl: './pay-salary.component.html',
  styleUrl: './pay-salary.component.css'
})
export class PaySalaryComponent implements OnInit {

  securityList: SecurityUser[] = [];
  selectedSecurity: SecurityUser | null = null;

  allMonths: string[] = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  selectedMonths: { [key: string]: boolean } = {};
  securityStatus: PaidStatus[] = [];

  amount: number = 0;
  ratePerMonth: number = 8000;
  showPaymentModal: boolean = false;

  API = 'http://localhost:5000/api/salary';
  SECURITY_API = 'http://localhost:5000/api/security';
  PAID_API = 'http://localhost:5000/api/salary/paid'; // Backend endpoint to fetch paid months

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.loadSecurityUsers();
    this.loadPaidMonths();
  }

  // ================= LOAD SECURITY =================
  loadSecurityUsers(): void {
    this.http.get<SecurityUser[]>(this.SECURITY_API).subscribe({
      next: (res) => this.securityList = Array.isArray(res) ? res : [],
      error: () => Swal.fire('Error', 'Failed to load security users', 'error')
    });
  }

  // ================= LOAD PAID MONTHS =================
  loadPaidMonths(): void {
    this.http.get<PaidStatus[]>(this.PAID_API).subscribe({
      next: (res) => this.securityStatus = Array.isArray(res) ? res : [],
      error: () => Swal.fire('Error', 'Failed to load paid months', 'error')
    });
  }

  // ================= CHECK IF MONTH IS PAID =================
  isMonthPaid(securityId: string, month: string): boolean {
    const status = this.securityStatus.find(s => s.securityId === securityId);
    return status ? status.paidMonths.includes(month) : false;
  }

  // ================= CALCULATE AMOUNT PER SECURITY =================
  getSecurityAmount(securityId: string): number {
    let count = 0;
    this.allMonths.forEach(m => {
      if (this.selectedMonths[securityId + '-' + m] && !this.isMonthPaid(securityId, m)) count++;
    });
    return count * this.ratePerMonth;
  }

  // ================= CALCULATE GRAND TOTAL =================
  calculateAmount(): void {
    let total = 0;
    this.securityList.forEach(s => total += this.getSecurityAmount(s._id));
    this.amount = total;
  }

  // ================= GET SELECTED MONTHS FOR MODAL =================
  getSelectedMonthsArray(): string[] {
    if (!this.selectedSecurity) return [];
    return this.allMonths.filter(m =>
      this.selectedMonths[this.selectedSecurity!._id + '-' + m] &&
      !this.isMonthPaid(this.selectedSecurity!._id, m)
    );
  }

  // ================= OPEN MODAL =================
  openPaymentModal(s: SecurityUser): void {
    if (this.getSecurityAmount(s._id) === 0) return;
    this.selectedSecurity = s;
    this.showPaymentModal = true;
  }

  // ================= CLOSE MODAL =================
  handleCloseModal(): void {
    this.showPaymentModal = false;
    this.selectedSecurity = null;
  }

  // ================= PAYMENT SUCCESS =================
  handlePaymentSuccess(data: any): void {
    console.log('✅ Salary Paid:', data);
    this.showPaymentModal = false;
    this.selectedSecurity = null;
    // Clear selected months for ALL securities
    this.selectedMonths = {};
    // Reset grand total
    this.amount = 0;
    // Refresh paid months from backend
    this.loadPaidMonths();
    Swal.fire('Success', 'Salary paid successfully!', 'success');
  }
}
