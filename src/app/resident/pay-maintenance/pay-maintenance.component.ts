// ================= pay-maintenance.component.ts =================

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { ResidentNavComponent } from '../../nav/resident-nav/resident-nav.component';

interface ResidentFlat {
  block: string;
  flat: string;
}

interface FlatStatus {
  block: string;
  flat: string;
  paidMonths: string[];
}

@Component({
  selector: 'app-pay-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, PaymentModalComponent, ResidentNavComponent],
  templateUrl: './pay-maintenance.component.html',
  styleUrls: ['./pay-maintenance.component.css']
})
export class PayMaintenanceComponent implements OnInit {

  email = '';
  name = '';
  residentId = '';

  flats: ResidentFlat[] = [];
  selectedFlats: ResidentFlat[] = [];

  allMonths: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  flatStatus: FlatStatus[] = [];
  selectedFlatMonths: {[key: string]: boolean} = {};

  amount = 0;

  showPaymentModal = false;

  API = 'http://localhost:5000/api/maintenance';
  RESIDENT_API = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchResident();
  }

  fetchResident() {
    const email = localStorage.getItem("email");

    this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`).subscribe({
      next: (res) => {
        this.name = res.name;
        this.email = res.email;
        this.flats = res.flats || [];
        this.selectedFlats = [...this.flats];
        this.residentId = res._id;
        this.loadFlatStatus();
      },
      error: () => Swal.fire("Error", "Profile load failed", "error")
    });
  }

  loadFlatStatus() {
    if (!this.residentId) return;

    this.http.get<any>(`${this.API}/data?residentId=${this.residentId}`).subscribe({
      next: (res) => {
        this.flatStatus = this.flats.map(f => {
          const paidMonths: string[] = res.payments
            .filter((p: { block: string; flat: string; month: string }) => p.block === f.block && p.flat === f.flat)
            .map((p: { block: string; flat: string; month: string }) => p.month);
          return { block: f.block, flat: f.flat, paidMonths: Array.from(new Set(paidMonths)) };
        });

        this.selectedFlatMonths = {};
        this.selectedFlats.forEach(f => {
          this.allMonths.forEach(m => {
            const key = f.block + '-' + f.flat + '-' + m;
            this.selectedFlatMonths[key] = false;
          });
        });

        this.calculateAmount();
      },
      error: () => Swal.fire('Error','Failed to load flat payment status','error')
    });
  }

  isPaid(block: string, flat: string, month: string): boolean {
    const fs = this.flatStatus.find(f => f.block === block && f.flat === flat);
    return fs ? fs.paidMonths.includes(month) : false;
  }

  addFlat() {
    const remaining = this.flats.filter(f => !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat));
    if (remaining.length > 0) {
      this.selectedFlats.push(remaining[0]);
      this.loadFlatStatus();
    }
  }

  removeFlat(index: number) {
    this.selectedFlats.splice(index, 1);
    this.loadFlatStatus();
  }

  payFullYear() {
    const ratePerMonth = 1000;
    this.selectedFlats.forEach(f => {
      const fs = this.flatStatus.find(fl => fl.block === f.block && fl.flat === f.flat);
      if (!fs) return;
      this.allMonths.forEach(m => {
        const key = f.block + '-' + f.flat + '-' + m;
        if (!fs.paidMonths.includes(m)) this.selectedFlatMonths[key] = true;
      });
    });
    this.calculateAmount();
  }

  calculateAmount() {
    const ratePerMonth = 1000;
    let totalSelectedMonths = 0;
    for (const f of this.selectedFlats) {
      const fs = this.flatStatus.find(fl => fl.block === f.block && fl.flat === f.flat);
      if (!fs) continue;
      this.allMonths.forEach(m => {
        const key = f.block + '-' + f.flat + '-' + m;
        if (!this.selectedFlatMonths[key]) this.selectedFlatMonths[key] = false;
        if (this.selectedFlatMonths[key] && !fs.paidMonths.includes(m)) totalSelectedMonths++;
      });
    }
    this.amount = totalSelectedMonths * ratePerMonth;
  }

  openPaymentModal() {
    if (this.amount === 0) { Swal.fire('Error','Select at least one month','error'); return; }
     // Ensure every selected month is mapped to a flat
        this.selectedFlats.forEach(f => {
          this.allMonths.forEach(m => {
            const key = f.block + '-' + f.flat + '-' + m;
            if (!(key in this.selectedFlatMonths)) this.selectedFlatMonths[key] = false;
          });
        });
    this.showPaymentModal = true;
  }
  handleCloseModal() {
    this.showPaymentModal = false;
  }

  handlePaymentSuccess(data: any) {
    console.log("✅ Payment Success:", data);

    // Close modal
    this.showPaymentModal = false;

    // 🔄 Reload data so UI updates (VERY IMPORTANT)
    this.loadFlatStatus();

    Swal.fire('Success', 'Payment completed successfully!', 'success');
  }
}
