// // // // // // /*import { Component } from '@angular/core';
// // // // // // import { FormsModule } from '@angular/forms';
// // // // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // // // import Swal from 'sweetalert2';
// // // // // // import { Router,RouterModule } from '@angular/router';
// // // // // // import { CommonModule } from '@angular/common';

// // // // // // @Component({
// // // // // //   selector: 'app-pay-maintenance',
// // // // // //   standalone: true,
// // // // // //   imports: [CommonModule,FormsModule, HttpClientModule,RouterModule],
// // // // // //   templateUrl: './pay-maintenance.component.html',
// // // // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // // // })
// // // // // // export class PayMaintenanceComponent {

// // // // // //   amount: number = 0;
// // // // // //   month: string = '';
// // // // // //   method: string = '';

// // // // // //   months = [
// // // // // //     'January','February','March','April','May','June',
// // // // // //     'July','August','September','October','November','December'
// // // // // //   ];

// // // // // //   private API = 'http://localhost:5000/api/maintenance';

// // // // // //   constructor(private http: HttpClient, private router: Router) {}


// // // // // //   payMaintenance() {

// // // // // //     if (!this.amount || !this.month || !this.method) {
// // // // // //       Swal.fire('Error', 'All fields required', 'error');
// // // // // //       return;
// // // // // //     }

// // // // // //     const data = {
// // // // // //       amount: this.amount,
// // // // // //       month: this.month,
// // // // // //       method: this.method
// // // // // //     };

// // // // // //     this.http.post(this.API, data).subscribe({
// // // // // //       next: () => {
// // // // // //         Swal.fire('Success', 'Payment Successful', 'success');
// // // // // //         this.amount = 0;
// // // // // //         this.month = '';
// // // // // //         this.method = '';
// // // // // //       },
// // // // // //       error: () => {
// // // // // //         Swal.fire('Error', 'Payment Failed', 'error');
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //    // Navbar state
// // // // // //   menuOpen = false;
// // // // // //   servicesOpen = false;
// // // // // //   complaintsOpen = false;
// // // // // //   maintenanceOpen = false;

// // // // // //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// // // // // //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// // // // // //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// // // // // //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }


// // // // // //   // Logout function
// // // // // //   logout() {
// // // // // //     Swal.fire({
// // // // // //       title: 'Logout?',
// // // // // //       text: 'Are you sure you want to logout?',
// // // // // //       icon: 'warning',
// // // // // //       showCancelButton: true,
// // // // // //       confirmButtonText: 'Yes, Logout'
// // // // // //     }).then((result) => {
// // // // // //       if (result.isConfirmed) {
// // // // // //         localStorage.clear();
// // // // // //         Swal.fire({
// // // // // //           icon: 'success',
// // // // // //           title: 'Logged Out',
// // // // // //           timer: 1200,
// // // // // //           showConfirmButton: false
// // // // // //         }).then(() => {
// // // // // //           this.router.navigate(['/login']);
// // // // // //         });
// // // // // //       }
// // // // // //     });
// // // // // //   }
// // // // // // }
// // // // // // import { Component } from '@angular/core';
// // // // // // import { CommonModule } from '@angular/common';
// // // // // // import { FormsModule } from '@angular/forms';
// // // // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // // // import Swal from 'sweetalert2';
// // // // // // import { Router } from '@angular/router';

// // // // // // @Component({
// // // // // //   selector: 'app-pay-maintenance',
// // // // // //   standalone: true,
// // // // // //   imports: [CommonModule, FormsModule, HttpClientModule],
// // // // // //   templateUrl: './pay-maintenance.component.html',
// // // // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // // // })
// // // // // // export class PayMaintenanceComponent {

// // // // // //   amount: number = 0;
// // // // // //   month: string = '';
// // // // // //   method: string = '';

// // // // // //   months = [
// // // // // //     'January','February','March','April','May','June',
// // // // // //     'July','August','September','October','November','December'
// // // // // //   ];

// // // // // //   unpaidMonths: string[] = []; // Will hold months available for payment

// // // // // //   private API = 'http://localhost:5000/api/maintenance';

// // // // // //   constructor(private http: HttpClient, private router: Router) {
// // // // // //     this.loadUnpaidMonths();
// // // // // //   }

// // // // // //   // Load unpaid months from backend (simulate or fetch)
// // // // // //   loadUnpaidMonths() {
// // // // // //     // Example: fetch from backend
// // // // // //     this.http.get<string[]>(`${this.API}/unpaid-months`).subscribe({
// // // // // //       next: (data) => {
// // // // // //         this.unpaidMonths = data;
// // // // // //         // Set default month as first unpaid month or current month
// // // // // //         const currentMonth = this.months[new Date().getMonth()];
// // // // // //         this.month = this.unpaidMonths.includes(currentMonth)
// // // // // //           ? currentMonth
// // // // // //           : this.unpaidMonths[0] || '';
// // // // // //       },
// // // // // //       error: () => {
// // // // // //         Swal.fire('Error', 'Cannot fetch unpaid months', 'error');
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   payMaintenance() {
// // // // // //     if (!this.amount || !this.month || !this.method) {
// // // // // //       Swal.fire('Error', 'All fields required', 'error');
// // // // // //       return;
// // // // // //     }

// // // // // //     // Prevent paying already paid month
// // // // // //     if (!this.unpaidMonths.includes(this.month)) {
// // // // // //       Swal.fire('Error', 'This month is already paid', 'error');
// // // // // //       return;
// // // // // //     }

// // // // // //     const data = {
// // // // // //       amount: this.amount,
// // // // // //       month: this.month,
// // // // // //       method: this.method
// // // // // //     };

// // // // // //     this.http.post(this.API, data).subscribe({
// // // // // //       next: () => {
// // // // // //         Swal.fire('Success', 'Payment Successful', 'success');
// // // // // //         // Reset form
// // // // // //         this.amount = 0;
// // // // // //         this.method = '';
// // // // // //         // Remove paid month from dropdown
// // // // // //         this.unpaidMonths = this.unpaidMonths.filter(m => m !== this.month);
// // // // // //         this.month = this.unpaidMonths[0] || '';
// // // // // //       },
// // // // // //       error: () => {
// // // // // //         Swal.fire('Error', 'Payment Failed', 'error');
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // Navbar state
// // // // // //   menuOpen = false;
// // // // // //   servicesOpen = false;
// // // // // //   complaintsOpen = false;
// // // // // //   maintenanceOpen = false;

// // // // // //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// // // // // //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// // // // // //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// // // // // //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// // // // // //   // Logout function
// // // // // //   logout() {
// // // // // //     Swal.fire({
// // // // // //       title: 'Logout?',
// // // // // //       text: 'Are you sure you want to logout?',
// // // // // //       icon: 'warning',
// // // // // //       showCancelButton: true,
// // // // // //       confirmButtonText: 'Yes, Logout'
// // // // // //     }).then((result) => {
// // // // // //       if (result.isConfirmed) {
// // // // // //         localStorage.clear();
// // // // // //         Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
// // // // // //           .then(() => this.router.navigate(['/login']));
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // // }
// // // // // // */

// // // // // // import { Component } from '@angular/core';
// // // // // // import { CommonModule } from '@angular/common';
// // // // // // import { FormsModule } from '@angular/forms';
// // // // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // // // import Swal from 'sweetalert2';
// // // // // // import { Router, RouterModule } from '@angular/router';

// // // // // // @Component({
// // // // // //   selector: 'app-pay-maintenance',
// // // // // //   standalone: true,
// // // // // //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// // // // // //   templateUrl: './pay-maintenance.component.html',
// // // // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // // // })
// // // // // // export class PayMaintenanceComponent {

// // // // // //   amount: number = 0;
// // // // // //   month: string = '';
// // // // // //   method: string = '';

// // // // // //   months = [
// // // // // //     'January','February','March','April','May','June',
// // // // // //     'July','August','September','October','November','December'
// // // // // //   ];

// // // // // //   unpaidMonths: string[] = []; // Holds months available for payment

// // // // // //   private API = 'http://localhost:5000/api/maintenance';

// // // // // //   constructor(private http: HttpClient, private router: Router) {
// // // // // //     this.loadUnpaidMonths();
// // // // // //   }

// // // // // //   // Load unpaid months from backend
// // // // // //   loadUnpaidMonths() {
// // // // // //     this.http.get<{ month: string, year: number }[]>(`${this.API}/unpaid-months`).subscribe({
// // // // // //       next: (data) => {
// // // // // //         // Use the getUnpaidMonths logic
// // // // // //         this.unpaidMonths = this.calculateUnpaidMonths(data);
// // // // // //         // Default selection = first unpaid month
// // // // // //         this.month = this.unpaidMonths[0] || '';
// // // // // //       },
// // // // // //       error: () => {
// // // // // //         // If backend fails, assume no data → start from January
// // // // // //         this.unpaidMonths = this.calculateUnpaidMonths([]);
// // // // // //         this.month = this.unpaidMonths[0] || '';
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // Calculate unpaid months
// // // // // //   calculateUnpaidMonths(maintenanceRecords: { month: string, year: number }[]): string[] {
// // // // // //     const unpaid: string[] = [];
// // // // // //     const today = new Date();
// // // // // //     const currentMonth = today.getMonth(); // 0 = Jan
// // // // // //     const currentYear = today.getFullYear();

// // // // // //     if (!maintenanceRecords || maintenanceRecords.length === 0) {
// // // // // //       // No records → start from January
// // // // // //       for (let m = 0; m <= currentMonth; m++) {
// // // // // //         unpaid.push(this.months[m]);
// // // // // //       }
// // // // // //     } else {
// // // // // //       // Records exist → start from next unpaid month
// // // // // //       const lastPaid = maintenanceRecords[maintenanceRecords.length - 1];
// // // // // //       let lastIndex = this.months.indexOf(lastPaid.month);
// // // // // //       let year = lastPaid.year;
// // // // // //       let m = lastIndex + 1;

// // // // // //       while (year < currentYear || (year === currentYear && m <= currentMonth)) {
// // // // // //         if (m > 11) { m = 0; year++; }
// // // // // //         unpaid.push(this.months[m]);
// // // // // //         m++;
// // // // // //       }
// // // // // //     }

// // // // // //     return unpaid;
// // // // // //   }

// // // // // //   // Pay maintenance
// // // // // //   payMaintenance() {
// // // // // //     if (!this.amount || !this.month || !this.method) {
// // // // // //       Swal.fire('Error', 'All fields required', 'error');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!this.unpaidMonths.includes(this.month)) {
// // // // // //       Swal.fire('Error', 'This month is already paid', 'error');
// // // // // //       return;
// // // // // //     }

// // // // // //     const data = { amount: this.amount, month: this.month, method: this.method };

// // // // // //     this.http.post(this.API, data).subscribe({
// // // // // //       next: () => {
// // // // // //         Swal.fire('Success', 'Payment Successful', 'success');
// // // // // //         this.amount = 0;
// // // // // //         this.method = '';
// // // // // //         // Remove paid month from dropdown
// // // // // //         this.unpaidMonths = this.unpaidMonths.filter(m => m !== this.month);
// // // // // //         this.month = this.unpaidMonths[0] || '';
// // // // // //       },
// // // // // //       error: () => {
// // // // // //         Swal.fire('Error', 'Payment Failed', 'error');
// // // // // //       }
// // // // // //     });
// // // // // //   }

// // // // // //   // Navbar state
// // // // // //   menuOpen = false;
// // // // // //   servicesOpen = false;
// // // // // //   complaintsOpen = false;
// // // // // //   maintenanceOpen = false;

// // // // // //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// // // // // //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// // // // // //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// // // // // //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// // // // // //   // Logout
// // // // // //   logout() {
// // // // // //     Swal.fire({
// // // // // //       title: 'Logout?',
// // // // // //       text: 'Are you sure you want to logout?',
// // // // // //       icon: 'warning',
// // // // // //       showCancelButton: true,
// // // // // //       confirmButtonText: 'Yes, Logout'
// // // // // //     }).then((result) => {
// // // // // //       if (result.isConfirmed) {
// // // // // //         localStorage.clear();
// // // // // //         Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
// // // // // //           .then(() => this.router.navigate(['/login']));
// // // // // //       }
// // // // // //     });
// // // // // //   }
// // // // // // }

// // // // // import { Component } from '@angular/core';
// // // // // import { CommonModule } from '@angular/common';
// // // // // import { FormsModule } from '@angular/forms';
// // // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // // import Swal from 'sweetalert2';
// // // // // import { Router, RouterModule } from '@angular/router';

// // // // // @Component({
// // // // //   selector: 'app-pay-maintenance',
// // // // //   standalone: true,
// // // // //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// // // // //   templateUrl: './pay-maintenance.component.html',
// // // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // // })
// // // // // export class PayMaintenanceComponent {
// // // // //   // ===== Resident Info =====
// // // // //   name: string = '';
// // // // //   email: string = '';
// // // // //   flats: number[] = [101, 102]; // Example: fetch from backend if needed
// // // // //   selectedFlats: number[] = [];

// // // // //   // ===== Payment Info =====
// // // // //   months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// // // // //   unpaidMonths: string[] = [];
// // // // //   selectedMonths: string[] = [];
// // // // //   amount: number = 0;
// // // // //   method: string = '';

// // // // //   private API = 'http://localhost:5000/api/maintenance';

// // // // //   // ===== Navbar State =====
// // // // //   menuOpen = false;
// // // // //   servicesOpen = false;
// // // // //   complaintsOpen = false;
// // // // //   maintenanceOpen = false;

// // // // //   constructor(private http: HttpClient, private router: Router) {
// // // // //     this.loadUnpaidMonths();
// // // // //   }

// // // // //   // ===== Load Unpaid Months (simulate fetch from backend) =====
// // // // //   loadUnpaidMonths() {
// // // // //     const today = new Date();
// // // // //     const currentMonth = today.getMonth();
// // // // //     this.unpaidMonths = this.months.slice(0, currentMonth + 1);
// // // // //   }

// // // // //   // ===== Calculate Total Amount =====
// // // // //   calculateAmount() {
// // // // //     const ratePerFlat = 1000; // Replace with backend rate per flat
// // // // //     this.amount = this.selectedFlats.length * this.selectedMonths.length * ratePerFlat;
// // // // //   }

// // // // //   // ===== Pay Now Function =====
// // // // //   payNow() {
// // // // //     if (!this.name || !this.email || this.selectedFlats.length === 0 || this.selectedMonths.length === 0 || !this.method) {
// // // // //       Swal.fire('Error', 'All fields are required', 'error');
// // // // //       return;
// // // // //     }

// // // // //     this.calculateAmount();

// // // // //     if (this.method === 'Cash') {
// // // // //       this.storePayment();
// // // // //     } else if (this.method === 'UPI') {
// // // // //       this.openUPIPage();
// // // // //     } else if (this.method === 'Card') {
// // // // //       this.openCardPage();
// // // // //     }
// // // // //   }

// // // // //   // ===== Store Payment =====
// // // // //   storePayment() {
// // // // //     const data = {
// // // // //       name: this.name,
// // // // //       email: this.email,
// // // // //       flats: this.selectedFlats,
// // // // //       months: this.selectedMonths,
// // // // //       amount: this.amount,
// // // // //       method: this.method
// // // // //     };

// // // // //     this.http.post(this.API, data).subscribe({
// // // // //       next: () => {
// // // // //         Swal.fire('Success', 'Payment Recorded', 'success');
// // // // //         // Remove paid months from dropdown
// // // // //         this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// // // // //         this.selectedMonths = [];
// // // // //         this.amount = 0;
// // // // //         this.method = '';
// // // // //       },
// // // // //       error: () => Swal.fire('Error', 'Payment Failed', 'error')
// // // // //     });
// // // // //   }

// // // // //   // ===== UPI Payment Modal =====
// // // // //   openUPIPage() {
// // // // //     Swal.fire({
// // // // //       title: 'Pay via UPI',
// // // // //       html: `Scan this QR with your UPI app to pay ₹${this.amount}`,
// // // // //       imageUrl: 'assets/gpay-qr.png', // replace with dynamic QR if needed
// // // // //       confirmButtonText: 'Paid'
// // // // //     }).then((result) => {
// // // // //       if (result.isConfirmed) this.storePayment();
// // // // //     });
// // // // //   }

// // // // //   // ===== Card Payment Modal =====
// // // // //   openCardPage() {
// // // // //     Swal.fire({
// // // // //       title: 'Card Payment',
// // // // //       html: `<input type="text" id="card" placeholder="Card Number" class="swal2-input">
// // // // //              <input type="text" id="expiry" placeholder="MM/YY" class="swal2-input">
// // // // //              <input type="text" id="cvv" placeholder="CVV" class="swal2-input">`,
// // // // //       confirmButtonText: 'Pay'
// // // // //     }).then((result) => {
// // // // //       if (result.isConfirmed) this.storePayment();
// // // // //     });
// // // // //   }

// // // // //   // ===== Navbar Toggle Functions =====
// // // // //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// // // // //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// // // // //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// // // // //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// // // // //   // ===== Logout =====
// // // // //   logout() {
// // // // //     Swal.fire({
// // // // //       title: 'Logout?',
// // // // //       text: 'Are you sure you want to logout?',
// // // // //       icon: 'warning',
// // // // //       showCancelButton: true,
// // // // //       confirmButtonText: 'Yes, Logout'
// // // // //     }).then((result) => {
// // // // //       if (result.isConfirmed) {
// // // // //         localStorage.clear();
// // // // //         Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
// // // // //           .then(() => this.router.navigate(['/login']));
// // // // //       }
// // // // //     });
// // // // //   }
// // // // // }

// // // // // import { Component, OnInit } from '@angular/core';
// // // // // import { Router } from '@angular/router';
// // // // // import Swal from 'sweetalert2';
// // // // // import { CommonModule } from '@angular/common';
// // // // // import { FormsModule } from '@angular/forms';
// // // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // // import { RouterModule } from '@angular/router';
// // // // // interface ResidentFlat {
// // // // //   block: string;
// // // // //   flat: string;
// // // // // }


// // // // // @Component({
// // // // //   selector: 'app-pay-maintenance',
// // // // //   standalone: true,
// // // // //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// // // // //   templateUrl: './pay-maintenance.component.html',
// // // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // // })
// // // // // export class PayMaintenanceComponent implements OnInit {

// // // // //   // ===== Resident Info =====
// // // // //   email: string = '';
// // // // //   name: string = '';
// // // // //   flats: ResidentFlat[] = [];
// // // // //   selectedFlats: ResidentFlat[] = [];

// // // // //   // ===== Payment Info =====
// // // // //   months: string[] = [];
// // // // //   unpaidMonths: string[] = [];
// // // // //   selectedMonths: string[] = [];
// // // // //   amount: number = 0;
// // // // //   method: string = '';

// // // // //   API = 'http://localhost:5000/api/maintenance';
// // // // //   RESIDENT_API = 'http://localhost:5000/api/residents';

// // // // //   // ===== Navbar State =====

// // // // //   constructor(private http: HttpClient, private router: Router) { }

// // // // //   ngOnInit() {
// // // // //     this.loadAllMonths();
// // // // //   }


// // // // //   menuOpen = false;
// // // // //   servicesOpen = false;
// // // // //   complaintsOpen = false;
// // // // //   maintenanceOpen = false;

// // // // //   toggleMenu() {
// // // // //     this.menuOpen = !this.menuOpen;
// // // // //   }

// // // // //   toggleServices() {
// // // // //     this.servicesOpen = !this.servicesOpen;
// // // // //   }

// // // // //   toggleComplaints() {
// // // // //     this.complaintsOpen = !this.complaintsOpen;
// // // // //   }

// // // // //   toggleMaintenance() {
// // // // //     this.maintenanceOpen = !this.maintenanceOpen;
// // // // //   }

// // // // //   logout() {
// // // // //     Swal.fire({
// // // // //       title: 'Logout?',
// // // // //       text: 'Are you sure you want to logout?',
// // // // //       icon: 'warning',
// // // // //       showCancelButton: true,
// // // // //       confirmButtonText: 'Yes, Logout'
// // // // //     }).then((result) => {
// // // // //       if (result.isConfirmed) {
// // // // //         localStorage.clear();
// // // // //         Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
// // // // //           .then(() => this.router.navigate(['/login']));
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   // ================= LOAD MONTHS =================
// // // // //   loadAllMonths() {
// // // // //     this.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// // // // //   }

// // // // //   // ================= FETCH RESIDENT =================
// // // // //   // fetchResident() {
// // // // //   //   if (!this.email) return;

// // // // //   //   this.http.get<any>(`${this.RESIDENT_API}/email/${this.email}`).subscribe({
// // // // //   //     next: (res) => {
// // // // //   //       this.name = res.name;
// // // // //   //       this.flats = res.flats.map((f: any) => ({ block: f.block, flat: f.flat }));
// // // // //   //       this.selectedFlats = [...this.flats];
// // // // //   //       this.loadUnpaidMonths();
// // // // //   //     },
// // // // //   //     error: () => {
// // // // //   //       Swal.fire('Error', 'Resident not found', 'error');
// // // // //   //       this.name = '';
// // // // //   //       this.flats = [];
// // // // //   //       this.selectedFlats = [];
// // // // //   //       this.unpaidMonths = [];
// // // // //   //     }
// // // // //   //   });
// // // // //   // }
// // // // //   fetchResident() {
// // // // //       const email = localStorage.getItem("email");

// // // // //       if (!email) {
// // // // //         this.router.navigate(['/login']);
// // // // //         return;
// // // // //       }

// // // // //       this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
// // // // //         .subscribe({
// // // // //           next: (res) => {
// // // // //             this.name = res.name;
// // // // //             this.email = res.email;
// // // // //             this.flats = res.flats;
// // // // //           },
// // // // //           error: () => {
// // // // //             Swal.fire("Error", "Failed to load profile", "error");
// // // // //           }
// // // // //         });
// // // // //     }

// // // // //   // ================= LOAD UNPAID MONTHS =================
// // // // //   loadUnpaidMonths() {
// // // // //     if (!this.email) return;

// // // // //     this.http.get<string[]>(`${this.API}/unpaid-months?email=${this.email}`).subscribe({
// // // // //       next: (data) => {
// // // // //         this.unpaidMonths = data;
// // // // //         this.selectedMonths = [];
// // // // //       },
// // // // //       error: () => {
// // // // //         Swal.fire('Error', 'Failed to load unpaid months', 'error');
// // // // //         this.unpaidMonths = [];
// // // // //       }
// // // // //     });
// // // // //   }

// // // // //   // ================= ADD / REMOVE FLAT =================
// // // // //   addFlat() { this.selectedFlats.push({ block: '', flat: '' }); }
// // // // //   removeFlat(index: number) { this.selectedFlats.splice(index, 1); }

// // // // //   // ================= CALCULATE AMOUNT =================
// // // // //   calculateAmount() {
// // // // //     const ratePerFlat = 1000; // replace with backend rate
// // // // //     this.amount = this.selectedFlats.length * this.selectedMonths.length * ratePerFlat;
// // // // //   }

// // // // //   // ================= PAY NOW =================
// // // // //   payNow() {
// // // // //     if (!this.name || !this.email || this.selectedFlats.length === 0 || this.selectedMonths.length === 0 || !this.method) {
// // // // //       Swal.fire('Error', 'All fields are required', 'error');
// // // // //       return;
// // // // //     }

// // // // //     this.calculateAmount();

// // // // //     if (this.method === 'Cash') this.storePayment();
// // // // //     else if (this.method === 'UPI') this.openUPIPage();
// // // // //     else if (this.method === 'Card') this.openCardPage();
// // // // //   }

// // // // //   // ================= STORE PAYMENT =================
// // // // //   storePayment() {
// // // // //     const data = {
// // // // //       email: this.email,
// // // // //       flats: this.selectedFlats,
// // // // //       months: this.selectedMonths,
// // // // //       amount: this.amount,
// // // // //       method: this.method
// // // // //     };

// // // // //     this.http.post(`${this.API}/pay`, data).subscribe({
// // // // //       next: () => {
// // // // //         Swal.fire('Success', 'Payment recorded', 'success');
// // // // //         this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// // // // //         this.selectedMonths = [];
// // // // //         this.amount = 0;
// // // // //         this.method = '';
// // // // //       },
// // // // //       error: () => Swal.fire('Error', 'Payment failed', 'error')
// // // // //     });
// // // // //   }

// // // // //   // ================= UPI PAYMENT =================
// // // // //   openUPIPage() {
// // // // //     Swal.fire({
// // // // //       title: 'Pay via UPI',
// // // // //       html: `Scan this QR with your UPI app to pay ₹${this.amount}`,
// // // // //       imageUrl: 'assets/gpay-qr.png',
// // // // //       confirmButtonText: 'Paid'
// // // // //     }).then(result => {
// // // // //       if (result.isConfirmed) this.storePayment();
// // // // //     });
// // // // //   }

// // // // //   // ================= CARD PAYMENT =================
// // // // //   openCardPage() {
// // // // //     Swal.fire({
// // // // //       title: 'Card Payment',
// // // // //       html: `<input type="text" id="card" placeholder="Card Number" class="swal2-input">
// // // // //              <input type="text" id="expiry" placeholder="MM/YY" class="swal2-input">
// // // // //              <input type="text" id="cvv" placeholder="CVV" class="swal2-input">`,
// // // // //       confirmButtonText: 'Pay'
// // // // //     }).then(result => {
// // // // //       if (result.isConfirmed) this.storePayment();
// // // // //     });
// // // // //   }
// // // // // }

// // // // import { Component, OnInit } from '@angular/core';
// // // // import { Router } from '@angular/router';
// // // // import Swal from 'sweetalert2';
// // // // import { CommonModule } from '@angular/common';
// // // // import { FormsModule } from '@angular/forms';
// // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // import { RouterModule } from '@angular/router';

// // // // interface ResidentFlat {
// // // //   block: string;
// // // //   flat: string;
// // // // }

// // // // @Component({
// // // //   selector: 'app-pay-maintenance',
// // // //   standalone: true,
// // // //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// // // //   templateUrl: './pay-maintenance.component.html',
// // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // })
// // // // export class PayMaintenanceComponent implements OnInit {

// // // //   // ===== Resident Info =====
// // // //   email: string = '';
// // // //   name: string = '';
// // // //   flats: ResidentFlat[] = [];
// // // //   selectedFlats: ResidentFlat[] = [];

// // // //   // ===== Payment Info =====
// // // //   unpaidMonths: string[] = [];
// // // //   selectedMonths: string[] = [];
// // // //   amount: number = 0;
// // // //   method: string = '';

// // // //   API = 'http://localhost:5000/api/maintenance';
// // // //   RESIDENT_API = 'http://localhost:5000/api/residents';

// // // //   constructor(private http: HttpClient, private router: Router) {}

// // // //   // ================= INIT =================
// // // //   ngOnInit() {
// // // //     this.fetchResident();
// // // //   }

// // // //   // ================= NAVBAR =================
// // // //   menuOpen = false;
// // // //   servicesOpen = false;
// // // //   complaintsOpen = false;
// // // //   maintenanceOpen = false;

// // // //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// // // //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// // // //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// // // //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// // // //   logout() {
// // // //     Swal.fire({
// // // //       title: 'Logout?',
// // // //       icon: 'warning',
// // // //       showCancelButton: true,
// // // //       confirmButtonText: 'Yes'
// // // //     }).then(result => {
// // // //       if (result.isConfirmed) {
// // // //         localStorage.clear();
// // // //         this.router.navigate(['/login']);
// // // //       }
// // // //     });
// // // //   }

// // // //   // ================= FETCH RESIDENT =================
// // // //   fetchResident() {
// // // //     const email = localStorage.getItem("email");

// // // //     if (!email) {
// // // //       this.router.navigate(['/login']);
// // // //       return;
// // // //     }

// // // //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
// // // //       .subscribe({
// // // //         next: (res) => {
// // // //           this.name = res.name;
// // // //           this.email = res.email;

// // // //           this.flats = res.flats || [];

// // // //           // initially all flats selected
// // // //           this.selectedFlats = [...this.flats];

// // // //           this.loadUnpaidMonths();
// // // //           this.calculateAmount();
// // // //         },
// // // //         error: () => {
// // // //           Swal.fire("Error", "Failed to load profile", "error");
// // // //         }
// // // //       });
// // // //   }

// // // //   // ================= LOAD UNPAID MONTHS =================
// // // //   loadUnpaidMonths() {
// // // //     this.http.get<string[]>(`${this.API}/unpaid-months?email=${this.email}`)
// // // //       .subscribe({
// // // //         next: (data) => {
// // // //           this.unpaidMonths = data || [];
// // // //         },
// // // //         error: () => {
// // // //           this.unpaidMonths = [];
// // // //         }
// // // //       });
// // // //   }

// // // //   // ================= ADD FLAT =================
// // // //   addFlat() {
// // // //     const remainingFlats = this.flats.filter(f =>
// // // //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// // // //     );

// // // //     if (remainingFlats.length > 0) {
// // // //       this.selectedFlats.push(remainingFlats[0]);
// // // //       this.calculateAmount();
// // // //     }
// // // //   }

// // // //   // ================= REMOVE FLAT =================
// // // //   removeFlat(index: number) {
// // // //     this.selectedFlats.splice(index, 1);
// // // //     this.calculateAmount();
// // // //   }

// // // //   // ================= CALCULATE AMOUNT =================
// // // //   calculateAmount() {
// // // //     const rate = 1000;
// // // //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// // // //   }

// // // //   // ================= PAY =================
// // // //   payNow() {
// // // //     if (!this.selectedMonths.length || !this.method) {
// // // //       Swal.fire('Error', 'Select months & payment method', 'error');
// // // //       return;
// // // //     }

// // // //     this.calculateAmount();

// // // //     if (this.method === 'Cash') this.storePayment();
// // // //     else if (this.method === 'UPI') this.openUPI();
// // // //     else if (this.method === 'Card') this.openCard();
// // // //   }

// // // //   // ================= STORE =================
// // // //   storePayment() {
// // // //     const data = {
// // // //       email: this.email,
// // // //       name: this.name,
// // // //       flats: this.selectedFlats,
// // // //       months: this.selectedMonths,
// // // //       amount: this.amount,
// // // //       method: this.method
// // // //     };

// // // //     this.http.post(`${this.API}/pay`, data)
// // // //       .subscribe({
// // // //         next: () => {
// // // //           Swal.fire('Success', 'Payment Done', 'success');

// // // //           this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// // // //           this.selectedMonths = [];
// // // //           this.amount = 0;
// // // //           this.method = '';
// // // //         },
// // // //         error: () => Swal.fire('Error', 'Payment failed', 'error')
// // // //       });
// // // //   }

// // // //   // ================= UPI =================
// // // //   openUPI() {
// // // //     Swal.fire({
// // // //       title: 'UPI Payment',
// // // //       html: `Pay ₹${this.amount}`,
// // // //       imageUrl: 'assets/gpay-qr.png',
// // // //       confirmButtonText: 'I Paid'
// // // //     }).then(r => { if (r.isConfirmed) this.storePayment(); });
// // // //   }

// // // //   // ================= CARD =================
// // // //   openCard() {
// // // //     Swal.fire({
// // // //       title: 'Card Payment',
// // // //       html: `
// // // //         <input class="swal2-input" placeholder="Card Number">
// // // //         <input class="swal2-input" placeholder="MM/YY">
// // // //         <input class="swal2-input" placeholder="CVV">
// // // //       `,
// // // //       confirmButtonText: 'Pay'
// // // //     }).then(r => { if (r.isConfirmed) this.storePayment(); });
// // // //   }
// // // // }

// // // // import { Component, OnInit } from '@angular/core';
// // // // import { Router } from '@angular/router';
// // // // import Swal from 'sweetalert2';
// // // // import { CommonModule } from '@angular/common';
// // // // import { FormsModule } from '@angular/forms';
// // // // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // // // import { RouterModule } from '@angular/router';

// // // // interface ResidentFlat {
// // // //   block: string;
// // // //   flat: string;
// // // // }

// // // // @Component({
// // // //   selector: 'app-pay-maintenance',
// // // //   standalone: true,
// // // //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// // // //   templateUrl: './pay-maintenance.component.html',
// // // //   styleUrls: ['./pay-maintenance.component.css']
// // // // })
// // // // export class PayMaintenanceComponent implements OnInit {

// // // //   email = '';
// // // //   name = '';

// // // //   flats: ResidentFlat[] = [];
// // // //   selectedFlats: ResidentFlat[] = [];

// // // //   unpaidMonths: string[] = [];
// // // //   selectedMonths: string[] = [];

// // // //   amount = 0;
// // // //   method = '';

// // // //   API = 'http://localhost:5000/api/maintenance';
// // // //   RESIDENT_API = 'http://localhost:5000/api/residents';

// // // //   constructor(private http: HttpClient, private router: Router) {}

// // // //   ngOnInit() {
// // // //     this.fetchResident();
// // // //   }

// // // //   // ================= FETCH RESIDENT =================
// // // //   fetchResident() {
// // // //     const email = localStorage.getItem("email");

// // // //     if (!email) {
// // // //       this.router.navigate(['/login']);
// // // //       return;
// // // //     }

// // // //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
// // // //       .subscribe({
// // // //         next: (res) => {
// // // //           this.name = res.name;
// // // //           this.email = res.email;

// // // //           this.flats = res.flats || [];
// // // //           this.selectedFlats = [...this.flats];

// // // //           this.loadUnpaidMonths();
// // // //           this.calculateAmount();
// // // //         },
// // // //         error: () => {
// // // //           Swal.fire("Error", "Profile load failed", "error");
// // // //         }
// // // //       });
// // // //   }

// // // //   // ================= LOAD MONTHS =================
// // // //   loadUnpaidMonths() {
// // // //     this.http.get<string[]>(`${this.API}/unpaid-months?email=${this.email}`)
// // // //       .subscribe({
// // // //         next: (data) => {
// // // //           // ✅ fallback if backend empty
// // // //           if (!data || data.length === 0) {
// // // //             this.unpaidMonths = [
// // // //               'January','February','March','April',
// // // //               'May','June','July','August',
// // // //               'September','October','November','December'
// // // //             ];
// // // //           } else {
// // // //             this.unpaidMonths = data;
// // // //           }
// // // //         },
// // // //         error: () => {
// // // //           // ✅ fallback if API fails
// // // //           this.unpaidMonths = [
// // // //             'January','February','March','April',
// // // //             'May','June','July','August',
// // // //             'September','October','November','December'
// // // //           ];
// // // //         }
// // // //       });
// // // //   }

// // // //   // ================= ADD FLAT =================
// // // //   addFlat() {
// // // //     const remaining = this.flats.filter(f =>
// // // //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// // // //     );

// // // //     if (remaining.length > 0) {
// // // //       this.selectedFlats.push(remaining[0]);
// // // //       this.calculateAmount();
// // // //     }
// // // //   }

// // // //   // ================= REMOVE FLAT =================
// // // //   removeFlat(index: number) {
// // // //     this.selectedFlats.splice(index, 1);
// // // //     this.calculateAmount();
// // // //   }

// // // //   // ================= CALCULATE =================
// // // //   calculateAmount() {
// // // //     const rate = 1000;
// // // //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// // // //   }

// // // //   // ================= PAY =================
// // // //   payNow() {

// // // //     if (!this.selectedMonths.length) {
// // // //       Swal.fire('Error', 'Select months', 'error');
// // // //       return;
// // // //     }

// // // //     if (!this.method) {
// // // //       Swal.fire('Error', 'Select payment method', 'error');
// // // //       return;
// // // //     }

// // // //     this.calculateAmount();

// // // //     if (this.method === 'Cash') this.storePayment();
// // // //     else if (this.method === 'UPI') this.openUPI();
// // // //     else if (this.method === 'Card') this.openCard();
// // // //   }

// // // //   // ================= STORE =================
// // // //   storePayment() {
// // // //     const data = {
// // // //       email: this.email,
// // // //       name: this.name,
// // // //       flats: this.selectedFlats,
// // // //       months: this.selectedMonths,
// // // //       amount: this.amount,
// // // //       method: this.method
// // // //     };

// // // //     this.http.post(`${this.API}/pay`, data)
// // // //       .subscribe({
// // // //         next: () => {
// // // //           Swal.fire('Success', 'Payment Done', 'success');

// // // //           this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// // // //           this.selectedMonths = [];
// // // //           this.amount = 0;
// // // //           this.method = '';
// // // //         },
// // // //         error: () => Swal.fire('Error', 'Payment failed', 'error')
// // // //       });
// // // //   }

// // // //   // ================= UPI =================
// // // //   openUPI() {
// // // //     Swal.fire({
// // // //       title: 'UPI Payment',
// // // //       html: `Pay ₹${this.amount}`,
// // // //       imageUrl: 'assets/gpay-qr.png',
// // // //       confirmButtonText: 'I Paid'
// // // //     }).then(r => {
// // // //       if (r.isConfirmed) this.storePayment();
// // // //     });
// // // //   }

// // // //   // ================= CARD =================
// // // //   openCard() {
// // // //     Swal.fire({
// // // //       title: 'Card Payment',
// // // //       html: `
// // // //         <input class="swal2-input" placeholder="Card Number">
// // // //         <input class="swal2-input" placeholder="MM/YY">
// // // //         <input class="swal2-input" placeholder="CVV">
// // // //       `,
// // // //       confirmButtonText: 'Pay'
// // // //     }).then(r => {
// // // //       if (r.isConfirmed) this.storePayment();
// // // //     });
// // // //   }
// // // //   // ===== NAVBAR STATE =====
// // // // menuOpen = false;
// // // // servicesOpen = false;
// // // // complaintsOpen = false;
// // // // maintenanceOpen = false;

// // // // // ===== TOGGLE FUNCTIONS =====
// // // // toggleMenu() {
// // // //   this.menuOpen = !this.menuOpen;
// // // // }

// // // // toggleServices() {
// // // //   this.servicesOpen = !this.servicesOpen;
// // // // }

// // // // toggleComplaints() {
// // // //   this.complaintsOpen = !this.complaintsOpen;
// // // // }

// // // // toggleMaintenance() {
// // // //   this.maintenanceOpen = !this.maintenanceOpen;
// // // // }

// // // // // ===== LOGOUT =====
// // // // logout() {
// // // //   Swal.fire({
// // // //     title: 'Logout?',
// // // //     text: 'Are you sure you want to logout?',
// // // //     icon: 'warning',
// // // //     showCancelButton: true,
// // // //     confirmButtonText: 'Yes'
// // // //   }).then(result => {
// // // //     if (result.isConfirmed) {
// // // //       localStorage.clear();
// // // //       this.router.navigate(['/login']);
// // // //     }
// // // //   });
// // // // }
// // // // }

// // import { Component, OnInit } from '@angular/core';
// // import { Router } from '@angular/router';
// // import Swal from 'sweetalert2';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // import { RouterModule } from '@angular/router';

// // interface ResidentFlat {
// //   block: string;
// //   flat: string;
// // }

// // @Component({
// //   selector: 'app-pay-maintenance',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// //   templateUrl: './pay-maintenance.component.html',
// //   styleUrls: ['./pay-maintenance.component.css']
// // })
// // export class PayMaintenanceComponent implements OnInit {

// //   email = '';
// //   name = '';
// //   residentId ='';

// //   flats: ResidentFlat[] = [];
// //   selectedFlats: ResidentFlat[] = [];

// //   unpaidMonths: string[] = [];
// //   paidMonths: string[] = [];
// //   selectedMonths: string[] = [];

// //   amount = 0;
// //   method = '';

// //   API = 'http://localhost:5000/api/maintenance';
// //   RESIDENT_API = 'http://localhost:5000/api/residents';

// //   constructor(private http: HttpClient, private router: Router) {}

// //   ngOnInit() {
// //     this.fetchResident();
// //   }

// //   // ================= FETCH RESIDENT =================
// //   fetchResident() {
// //     const email = localStorage.getItem("email");
// //     if (!email) {
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
// //       .subscribe({
// //         next: (res) => {
// //           this.name = res.name;
// //           this.email = res.email;
// //           this.flats = res.flats || [];
// //           this.selectedFlats = [...this.flats];

// //           // ✅ Load unpaid months after email is available
// //           this.loadUnpaidMonths();
// //         },
// //         error: () => Swal.fire("Error", "Profile load failed", "error")
// //       });
// //   }

// //   // ================= LOAD UNPAID MONTHS =================
// // loadUnpaidMonths() {
// //   const allMonths = [
// //     'January','February','March','April','May','June',
// //     'July','August','September','October','November','December'
// //   ];

// //  this.http.get<{ paidMonths: string[] }>(`${this.API}/paid-months?residentId=${this.residentId}`)
// //   .subscribe({
// //     next: (res) => {
// //       this.paidMonths = res.paidMonths;
// //       // calculate unpaid months dynamically
// //       const allMonths = [
// //         'January','February','March','April','May','June',
// //         'July','August','September','October','November','December'
// //       ];
// //       this.unpaidMonths = allMonths.filter(m => !this.paidMonths.includes(m));
// //     },
// //     error: () => {
// //       // fallback
// //       this.unpaidMonths = [
// //         'January','February','March','April','May','June',
// //         'July','August','September','October','November','December'
// //       ];
// //       this.paidMonths = [];
// //     }
// //   });
// // }
// //   // ================= ADD/REMOVE FLAT =================
// //   addFlat() {
// //     const remaining = this.flats.filter(f =>
// //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// //     );
// //     if (remaining.length > 0) {
// //       this.selectedFlats.push(remaining[0]);
// //       this.calculateAmount();
// //     }
// //   }

// //   removeFlat(index: number) {
// //     this.selectedFlats.splice(index, 1);
// //     this.calculateAmount();
// //   }

// //   // ================= CALCULATE AMOUNT =================
// //   calculateAmount() {
// //     const rate = 1000; // per flat per month
// //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// //   }

// //   // ================= PAY =================
// //   payNow() {
// //     if (!this.selectedMonths.length) {
// //       Swal.fire('Error', 'Select months', 'error');
// //       return;
// //     }

// //     if (!this.method) {
// //       Swal.fire('Error', 'Select payment method', 'error');
// //       return;
// //     }

// //     this.calculateAmount();

// //     if (this.method === 'Cash') this.storePayment();
// //     else if (this.method === 'UPI') this.openUPI();
// //     else if (this.method === 'Card') this.openCard();
// //   }

// //   // ================= STORE PAYMENT =================
// //   storePayment() {
// //     const data = {
// //       email: this.email,
// //       name: this.name,
// //       flats: this.selectedFlats,
// //       months: this.selectedMonths,
// //       amount: this.amount,
// //       method: this.method
// //     };

// //     this.http.post(`${this.API}/pay`, data)
// //       .subscribe({
// //         next: () => {
// //           Swal.fire('Success', 'Payment Done', 'success');

// //           // ✅ Remove paid months from dropdown
// //           this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// //           this.selectedMonths = [];
// //           this.amount = 0;
// //           this.method = '';
// //         },
// //         error: () => Swal.fire('Error', 'Payment failed', 'error')
// //       });
// //   }

// //   // ================= UPI PAYMENT =================
// //   openUPI() {
// //     Swal.fire({
// //       title: 'UPI Payment',
// //       html: `Pay ₹${this.amount}`,
// //       imageUrl: 'assets/gpay-qr.png',
// //       confirmButtonText: 'I Paid'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ================= CARD PAYMENT =================
// //   openCard() {
// //     Swal.fire({
// //       title: 'Card Payment',
// //       html: `
// //         <input class="swal2-input" placeholder="Card Number">
// //         <input class="swal2-input" placeholder="MM/YY">
// //         <input class="swal2-input" placeholder="CVV">
// //       `,
// //       confirmButtonText: 'Pay'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ===== NAVBAR STATE =====
// //   menuOpen = false;
// //   servicesOpen = false;
// //   complaintsOpen = false;
// //   maintenanceOpen = false;

// //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// //   // ===== LOGOUT =====
// //   logout() {
// //     Swal.fire({
// //       title: 'Logout?',
// //       text: 'Are you sure you want to logout?',
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonText: 'Yes'
// //     }).then(result => {
// //       if (result.isConfirmed) {
// //         localStorage.clear();
// //         this.router.navigate(['/login']);
// //       }
// //     });
// //   }
// // }
// // /*
// // import { Component, OnInit } from '@angular/core';
// // import { Router } from '@angular/router';
// // import Swal from 'sweetalert2';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // import { RouterModule } from '@angular/router';

// // interface ResidentFlat {
// //   block: string;
// //   flat: string;
// // }

// // @Component({
// //   selector: 'app-pay-maintenance',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// //   templateUrl: './pay-maintenance.component.html',
// //   styleUrls: ['./pay-maintenance.component.css']
// // })
// // export class PayMaintenanceComponent implements OnInit {

// //   email = '';
// //   name = '';
// //   residentId = '';

// //   flats: ResidentFlat[] = [];
// //   selectedFlats: ResidentFlat[] = [];

// //   paidMonths: string[] = [];
// //   unpaidMonths: string[] = [];
// //   selectedMonths: string[] = [];

// //   amount = 0;
// //   method = '';

// //   API = 'http://localhost:5000/api/maintenance';
// //   RESIDENT_API = 'http://localhost:5000/api/residents';

// //   // Navbar state
// //   menuOpen = false;

// //   constructor(private http: HttpClient, private router: Router) {}

// //   ngOnInit() {
// //     this.fetchResident();
// //   }

// //   // ================= FETCH RESIDENT =================
// //   fetchResident() {
// //     const email = localStorage.getItem("email");
// //     if (!email) {
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`).subscribe({
// //       next: res => {
// //         this.name = res.name;
// //         this.email = res.email;
// //         this.flats = res.flats || [];
// //         this.selectedFlats = [...this.flats];

// //         this.residentId = res._id || ''; // Make sure you have residentId from backend
// //         this.loadUnpaidMonths();
// //         this.calculateAmount();
// //       },
// //       error: () => Swal.fire("Error", "Profile load failed", "error")
// //     });
// //   }


// //   loadUnpaidMonths() {
// //   if (!this.residentId) return;

// //   this.http.get<{ paidMonths: string[], unpaidMonths: string[] }>(`${this.API}/status?residentId=${this.residentId}`)
// //     .subscribe({
// //       next: (res) => {
// //         this.paidMonths = res.paidMonths || [];
// //         this.unpaidMonths = res.unpaidMonths || [];
// //       },
// //       error: () => {
// //         this.unpaidMonths = [
// //           'January','February','March','April','May','June',
// //           'July','August','September','October','November','December'
// //         ];
// //         this.paidMonths = [];
// //       }
// //     });
// // }
// //   // ================= ADD/REMOVE FLAT =================
// //   addFlat() {
// //     const remaining = this.flats.filter(f =>
// //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// //     );
// //     if (remaining.length > 0) {
// //       this.selectedFlats.push(remaining[0]);
// //       this.calculateAmount();
// //     }
// //   }

// //   removeFlat(index: number) {
// //     this.selectedFlats.splice(index, 1);
// //     this.calculateAmount();
// //   }

// //   // ================= CALCULATE AMOUNT =================
// //   calculateAmount() {
// //     const rate = 1000; // per flat per month
// //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// //   }

// //   // ================= MONTH SELECTION =================
// //   toggleMonth(month: string) {
// //     const idx = this.selectedMonths.indexOf(month);
// //     if (idx > -1) this.selectedMonths.splice(idx, 1);
// //     else this.selectedMonths.push(month);

// //     this.calculateAmount();
// //   }

// //   // ================= PAY =================
// //   payNow() {
// //     if (!this.selectedMonths.length) {
// //       Swal.fire('Error', 'Select months', 'error');
// //       return;
// //     }
// //     if (!this.method) {
// //       Swal.fire('Error', 'Select payment method', 'error');
// //       return;
// //     }

// //     this.calculateAmount();

// //     if (this.method === 'Cash') this.storePayment();
// //     else if (this.method === 'UPI') this.openUPI();
// //     else if (this.method === 'Card') this.openCard();
// //   }

// //   // ================= STORE PAYMENT =================
// //   storePayment() {
// //     const data = {
// //       email: this.email,
// //       name: this.name,
// //       flats: this.selectedFlats,
// //       months: this.selectedMonths,
// //       amount: this.amount,
// //       method: this.method
// //     };

// //     this.http.post(`${this.API}/pay`, data).subscribe({
// //       next: () => {
// //         Swal.fire('Success', 'Payment Done', 'success');

// //         // Remove paid months from dropdown
// //         this.unpaidMonths = this.unpaidMonths.filter(m => !this.selectedMonths.includes(m));
// //         this.selectedMonths = [];
// //         this.amount = 0;
// //         this.method = '';
// //       },
// //       error: () => Swal.fire('Error', 'Payment failed', 'error')
// //     });
// //   }

// //   // ================= UPI PAYMENT =================
// //   openUPI() {
// //     Swal.fire({
// //       title: 'UPI Payment',
// //       html: `Pay ₹${this.amount}`,
// //       imageUrl: 'assets/gpay-qr.png',
// //       confirmButtonText: 'I Paid'
// //     }).then(r => { if (r.isConfirmed) this.storePayment(); });
// //   }

// //   // ================= CARD PAYMENT =================
// //   openCard() {
// //     Swal.fire({
// //       title: 'Card Payment',
// //       html: `
// //         <input class="swal2-input" placeholder="Card Number">
// //         <input class="swal2-input" placeholder="MM/YY">
// //         <input class="swal2-input" placeholder="CVV">
// //       `,
// //       confirmButtonText: 'Pay'
// //     }).then(r => { if (r.isConfirmed) this.storePayment(); });
// //   }

// //     // ===== NAVBAR STATE =====
// //   // menuOpen = false;
// //   servicesOpen = false;
// //   complaintsOpen = false;
// //   maintenanceOpen = false;

// //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// //   // ===== LOGOUT =====
// //   logout() {
// //     Swal.fire({
// //       title: 'Logout?',
// //       text: 'Are you sure you want to logout?',
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonText: 'Yes'
// //     }).then(result => {
// //       if (result.isConfirmed) {
// //         localStorage.clear();
// //         this.router.navigate(['/login']);
// //       }
// //     });
// //   }
// // }
// // */


// // import { Component, OnInit } from '@angular/core';
// // import { Router } from '@angular/router';
// // import Swal from 'sweetalert2';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // import { RouterModule } from '@angular/router';

// // interface ResidentFlat {
// //   block: string;
// //   flat: string;
// // }

// // @Component({
// //   selector: 'app-pay-maintenance',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// //   templateUrl: './pay-maintenance.component.html',
// //   styleUrls: ['./pay-maintenance.component.css']
// // })
// // export class PayMaintenanceComponent implements OnInit {

// //   email = '';
// //   name = '';
// //   residentId = '';

// //   flats: ResidentFlat[] = [];
// //   selectedFlats: ResidentFlat[] = [];

// //   unpaidMonths: string[] = [];
// //   paidMonths: string[] = [];
// //   selectedMonths: string[] = [];

// //   amount = 0;
// //   method = '';

// //   API = 'http://localhost:5000/api/maintenance';
// //   RESIDENT_API = 'http://localhost:5000/api/residents';

// //   constructor(private http: HttpClient, private router: Router) {}

// //   ngOnInit() {
// //     this.fetchResident();
// //   }

// //   // ================= FETCH RESIDENT =================
// //   fetchResident() {
// //     const email = localStorage.getItem("email");
// //     if (!email) {
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`)
// //       .subscribe({
// //         next: (res) => {
// //           this.name = res.name;
// //           this.email = res.email;
// //           this.flats = res.flats || [];
// //           this.selectedFlats = [...this.flats];
// //           this.residentId = res._id; // ✅ set residentId

// //           this.loadUnpaidMonths();
// //         },
// //         error: () => Swal.fire("Error", "Profile load failed", "error")
// //       });
// //   }

// //   // ================= LOAD UNPAID MONTHS =================
// //   loadUnpaidMonths() {
// //     if (!this.residentId) return;

// //     this.http.get<{ paidMonths: string[], unpaidMonths: string[] }>(`${this.API}/status?residentId=${this.residentId}`)
// //       .subscribe({
// //         next: (res) => {
// //           this.paidMonths = res.paidMonths;
// //           this.unpaidMonths = res.unpaidMonths;
// //         },
// //         error: () => {
// //           this.paidMonths = [];
// //           this.unpaidMonths = [];
// //         }
// //       });
// //   }

// //   // ================= ADD/REMOVE FLAT =================
// //   addFlat() {
// //     const remaining = this.flats.filter(f =>
// //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// //     );
// //     if (remaining.length > 0) {
// //       this.selectedFlats.push(remaining[0]);
// //       this.calculateAmount();
// //     }
// //   }

// //   removeFlat(index: number) {
// //     this.selectedFlats.splice(index, 1);
// //     this.calculateAmount();
// //   }

// //   // ================= CALCULATE AMOUNT =================
// //   calculateAmount() {
// //     const rate = 1000; // per flat per month
// //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// //   }

// //   // ================= PAY =================
// //   payNow() {
// //     if (!this.selectedMonths.length) {
// //       Swal.fire('Error', 'Select months', 'error');
// //       return;
// //     }

// //     if (!this.method) {
// //       Swal.fire('Error', 'Select payment method', 'error');
// //       return;
// //     }

// //     this.calculateAmount();

// //     if (this.method === 'Cash') this.storePayment();
// //     else if (this.method === 'UPI') this.openUPI();
// //     else if (this.method === 'Card') this.openCard();
// //   }

// //   // ================= STORE PAYMENT =================
// //   storePayment() {
// //     const data = {
// //       email: this.email,
// //       flats: this.selectedFlats,
// //       months: this.selectedMonths,
// //       amount: this.amount,
// //       method: this.method
// //     };

// //     this.http.post(`${this.API}/pay`, data)
// //       .subscribe({
// //         next: () => {
// //           Swal.fire('Success', 'Payment Done', 'success');
// //           // ✅ Refresh months from backend
// //           this.selectedMonths = [];
// //           this.amount = 0;
// //           this.method = '';
// //           this.loadUnpaidMonths();
// //         },
// //         error: () => Swal.fire('Error', 'Payment failed', 'error')
// //       });
// //   }

// //   // ================= UPI PAYMENT =================
// //   openUPI() {
// //     Swal.fire({
// //       title: 'UPI Payment',
// //       html: `Pay ₹${this.amount}`,
// //       imageUrl: 'assets/gpay-qr.png',
// //       confirmButtonText: 'I Paid'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ================= CARD PAYMENT =================
// //   openCard() {
// //     Swal.fire({
// //       title: 'Card Payment',
// //       html: `
// //         <input class="swal2-input" placeholder="Card Number">
// //         <input class="swal2-input" placeholder="MM/YY">
// //         <input class="swal2-input" placeholder="CVV">
// //       `,
// //       confirmButtonText: 'Pay'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ===== NAVBAR STATE =====
// //   menuOpen = false;
// //   servicesOpen = false;
// //   complaintsOpen = false;
// //   maintenanceOpen = false;

// //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// //   // ===== LOGOUT =====
// //   logout() {
// //     Swal.fire({
// //       title: 'Logout?',
// //       text: 'Are you sure you want to logout?',
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonText: 'Yes'
// //     }).then(result => {
// //       if (result.isConfirmed) {
// //         localStorage.clear();
// //         this.router.navigate(['/login']);
// //       }
// //     });
// //   }
// // }

// // import { Component, OnInit } from '@angular/core';
// // import { Router } from '@angular/router';
// // import Swal from 'sweetalert2';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { HttpClient, HttpClientModule } from '@angular/common/http';
// // import { RouterModule } from '@angular/router';

// // interface ResidentFlat {
// //   block: string;
// //   flat: string;
// // }

// // @Component({
// //   selector: 'app-pay-maintenance',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
// //   templateUrl: './pay-maintenance.component.html',
// //   styleUrls: ['./pay-maintenance.component.css']
// // })
// // export class PayMaintenanceComponent implements OnInit {

// //   email = '';
// //   name = '';
// //   residentId = '';

// //   flats: ResidentFlat[] = [];
// //   selectedFlats: ResidentFlat[] = [];

// //   allMonths: string[] = [];      // January → December
// //   unpaidMonths: string[] = [];   // Unpaid months
// //   paidMonths: string[] = [];     // Paid months
// //   selectedMonths: string[] = []; // Months selected by user

// //   amount = 0;
// //   method = '';

// //   API = 'http://localhost:5000/api/maintenance';
// //   RESIDENT_API = 'http://localhost:5000/api/residents';

// //   constructor(private http: HttpClient, private router: Router) {}

// //   ngOnInit() {
// //     this.fetchResident();
// //   }

// //   // ================= FETCH RESIDENT =================
// //   fetchResident() {
// //     const email = localStorage.getItem("email");
// //     if (!email) {
// //       this.router.navigate(['/login']);
// //       return;
// //     }

// //     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`).subscribe({
// //       next: (res) => {
// //         this.name = res.name;
// //         this.email = res.email;
// //         this.flats = res.flats || [];
// //         this.selectedFlats = [...this.flats];
// //         this.residentId = res._id;

// //         this.loadMonths(); // Load all months (paid/unpaid)
// //       },
// //       error: () => Swal.fire("Error", "Profile load failed", "error")
// //     });
// //   }

// //   // ================= LOAD MONTHS =================
// //   loadMonths() {
// //     if (!this.residentId) return;

// //     this.http.get<{ paidMonths: string[], unpaidMonths: string[] }>(`${this.API}/status?residentId=${this.residentId}`)
// //       .subscribe({
// //         next: (res) => {
// //           const monthOrder = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// //           this.allMonths = monthOrder;

// //           // Sort months according to calendar
// //           this.paidMonths = res.paidMonths.sort((a,b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
// //           this.unpaidMonths = res.unpaidMonths.sort((a,b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

// //           this.selectedMonths = [];
// //           this.calculateAmount();
// //         },
// //         error: () => {
// //           this.paidMonths = [];
// //           this.unpaidMonths = [];
// //           this.allMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// //         }
// //       });
// //   }

// //   // ================= ADD/REMOVE FLAT =================
// //   addFlat() {
// //     const remaining = this.flats.filter(f =>
// //       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
// //     );
// //     if (remaining.length > 0) {
// //       this.selectedFlats.push(remaining[0]);
// //       this.calculateAmount();
// //     }
// //   }

// //   removeFlat(index: number) {
// //     this.selectedFlats.splice(index, 1);
// //     this.calculateAmount();
// //   }

// //   // ================= CALCULATE AMOUNT =================
// //   calculateAmount() {
// //     const rate = 1000; // per flat per month
// //     this.amount = this.selectedFlats.length * this.selectedMonths.length * rate;
// //   }

// //   // ================= PAY =================
// //   payNow() {
// //     if (!this.selectedMonths.length) {
// //       Swal.fire('Error', 'Select months', 'error');
// //       return;
// //     }

// //     if (!this.method) {
// //       Swal.fire('Error', 'Select payment method', 'error');
// //       return;
// //     }

// //     this.calculateAmount();

// //     if (this.method === 'Cash') this.storePayment();
// //     else if (this.method === 'UPI') this.openUPI();
// //     else if (this.method === 'Card') this.openCard();
// //   }

// //   // ================= STORE PAYMENT =================
// //   storePayment() {
// //     const data = {
// //       email: this.email,
// //       flats: this.selectedFlats,
// //       months: this.selectedMonths,
// //       amount: this.amount,
// //       method: this.method
// //     };

// //     this.http.post(`${this.API}/pay`, data).subscribe({
// //       next: () => {
// //         Swal.fire('Success', 'Payment Done', 'success');
// //         this.selectedMonths = [];
// //         this.amount = 0;
// //         this.method = '';
// //         this.loadMonths();
// //       },
// //       error: () => Swal.fire('Error', 'Payment failed', 'error')
// //     });
// //   }

// //   // ================= UPI PAYMENT =================
// //   openUPI() {
// //     Swal.fire({
// //       title: 'UPI Payment',
// //       html: `Pay ₹${this.amount}`,
// //       imageUrl: 'assets/gpay-qr.png',
// //       confirmButtonText: 'I Paid'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ================= CARD PAYMENT =================
// //   openCard() {
// //     Swal.fire({
// //       title: 'Card Payment',
// //       html: `
// //         <input class="swal2-input" placeholder="Card Number">
// //         <input class="swal2-input" placeholder="MM/YY">
// //         <input class="swal2-input" placeholder="CVV">
// //       `,
// //       confirmButtonText: 'Pay'
// //     }).then(r => {
// //       if (r.isConfirmed) this.storePayment();
// //     });
// //   }

// //   // ================= NAVBAR STATE =================
// //   menuOpen = false;
// //   servicesOpen = false;
// //   complaintsOpen = false;
// //   maintenanceOpen = false;

// //   toggleMenu() { this.menuOpen = !this.menuOpen; }
// //   toggleServices() { this.servicesOpen = !this.servicesOpen; }
// //   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
// //   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

// //   // ================= LOGOUT =================
// //   logout() {
// //     Swal.fire({
// //       title: 'Logout?',
// //       text: 'Are you sure you want to logout?',
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonText: 'Yes'
// //     }).then(result => {
// //       if (result.isConfirmed) {
// //         localStorage.clear();
// //         this.router.navigate(['/login']);
// //       }
// //     });
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { RouterModule } from '@angular/router';

// interface ResidentFlat {
//   block: string;
//   flat: string;
// }

// interface FlatPaymentStatus {
//   block: string;
//   flat: string;
//   paidMonths: string[];
//   unpaidMonths: string[];
// }

// @Component({
//   selector: 'app-pay-maintenance',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
//   templateUrl: './pay-maintenance.component.html',
//   styleUrls: ['./pay-maintenance.component.css']
// })
// export class PayMaintenanceComponent implements OnInit {

//   email = '';
//   name = '';
//   residentId = '';

//   flats: ResidentFlat[] = [];
//   selectedFlats: ResidentFlat[] = [];

//   allMonths: string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];

//   // Flat-wise paid/unpaid months
//   flatStatus: FlatPaymentStatus[] = [];

//   // Track selected months per flat (key = block-flat-month)
//   selectedFlatMonths: { [key: string]: boolean } = {};

//   amount = 0;
//   method = '';

//   API = 'http://localhost:5000/api/maintenance';
//   RESIDENT_API = 'http://localhost:5000/api/residents';

//   // NAVBAR STATE
//   menuOpen = false;
//   servicesOpen = false;
//   complaintsOpen = false;
//   maintenanceOpen = false;

//   constructor(private http: HttpClient, private router: Router) {}

//   ngOnInit() {
//     this.fetchResident();
//   }

//   // ================= FETCH RESIDENT =================
//   fetchResident() {
//     const email = localStorage.getItem("email");
//     if (!email) {
//       this.router.navigate(['/login']);
//       return;
//     }

//     this.http.get<any>(`${this.RESIDENT_API}/profile/${email}`).subscribe({
//       next: (res) => {
//         this.name = res.name;
//         this.email = res.email;
//         this.flats = res.flats || [];
//         this.selectedFlats = [...this.flats];
//         this.residentId = res._id;

//         this.loadFlatMonths(); // Load flat-wise paid/unpaid months
//       },
//       error: () => Swal.fire("Error", "Profile load failed", "error")
//     });
//   }

//   // ================= LOAD FLAT MONTHS =================
//   loadFlatMonths() {
//     if (!this.residentId) return;

//     this.http.get<FlatPaymentStatus[]>(`${this.API}/flat-status?residentId=${this.residentId}`).subscribe({
//       next: (res) => {
//         this.flatStatus = res;
//         // Reset selected months
//         this.selectedFlatMonths = {};
//         this.calculateAmount();
//       },
//       error: () => {
//         this.flatStatus = [];
//         this.selectedFlatMonths = {};
//       }
//     });
//   }

//   // ================= CHECK IF MONTH PAID =================
//   isPaid(block: string, flat: string, month: string): boolean {
//     const f = this.flatStatus.find(f => f.block === block && f.flat === flat);
//     return f?.paidMonths.includes(month) || false;
//   }

//   // ================= SELECTED FLAT MONTHS =================
//   getSelectedFlatMonths(): { block: string, flat: string, month: string }[] {
//     const selected: { block:string, flat:string, month:string }[] = [];
//     for (const key in this.selectedFlatMonths) {
//       if (this.selectedFlatMonths[key]) {
//         const [block, flat, month] = key.split('-');
//         selected.push({ block, flat, month });
//       }
//     }
//     return selected;
//   }

//   // ================= CALCULATE AMOUNT =================
//   calculateAmount() {
//     const rate = 1000; // per flat per month
//     const selected = this.getSelectedFlatMonths();
//     this.amount = selected.length * rate;
//   }

//   // ================= PAY =================
//   payNow() {
//     const selected = this.getSelectedFlatMonths();
//     if (!selected.length) {
//       Swal.fire('Error','Select months to pay','error');
//       return;
//     }

//     if (!this.method) {
//       Swal.fire('Error','Select payment method','error');
//       return;
//     }

//     this.calculateAmount();

//     if (this.method === 'Cash') this.storePayment();
//     else if (this.method === 'UPI') this.openUPI();
//     else if (this.method === 'Card') this.openCard();
//   }

//   // ================= STORE PAYMENT =================
//   storePayment() {
//     const selected = this.getSelectedFlatMonths();
//     const data = {
//       email: this.email,
//       payments: selected,
//       amount: this.amount,
//       method: this.method
//     };

//     this.http.post(`${this.API}/pay`, data).subscribe({
//       next: () => {
//         Swal.fire('Success','Payment Done','success');
//         this.selectedFlatMonths = {};
//         this.amount = 0;
//         this.method = '';
//         this.loadFlatMonths();
//       },
//       error: () => Swal.fire('Error','Payment failed','error')
//     });
//   }

//   // ================= UPI PAYMENT =================
//   openUPI() {
//     Swal.fire({
//       title: 'UPI Payment',
//       html: `Pay ₹${this.amount}`,
//       imageUrl: 'assets/gpay-qr.png',
//       confirmButtonText: 'I Paid'
//     }).then(r => {
//       if (r.isConfirmed) this.storePayment();
//     });
//   }

//   // ================= CARD PAYMENT =================
//   openCard() {
//     Swal.fire({
//       title: 'Card Payment',
//       html: `
//         <input class="swal2-input" placeholder="Card Number">
//         <input class="swal2-input" placeholder="MM/YY">
//         <input class="swal2-input" placeholder="CVV">
//       `,
//       confirmButtonText: 'Pay'
//     }).then(r => {
//       if (r.isConfirmed) this.storePayment();
//     });
//   }

//   // ================= ADD/REMOVE FLAT =================
//   addFlat() {
//     const remaining = this.flats.filter(f =>
//       !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
//     );
//     if (remaining.length > 0) {
//       this.selectedFlats.push(remaining[0]);
//       this.calculateAmount();
//     }
//   }

//   removeFlat(index: number) {
//     this.selectedFlats.splice(index, 1);
//     this.calculateAmount();
//   }

//   // ================= NAVBAR =================
//   toggleMenu() { this.menuOpen = !this.menuOpen; }
//   toggleServices() { this.servicesOpen = !this.servicesOpen; }
//   toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
//   toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

//   // ================= LOGOUT =================
//   logout() {
//     Swal.fire({
//       title: 'Logout?',
//       text: 'Are you sure you want to logout?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes'
//     }).then(result => {
//       if (result.isConfirmed) {
//         localStorage.clear();
//         this.router.navigate(['/login']);
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
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
  flatStatus: FlatStatus[] = []; // Each flat's paid months
  selectedFlatMonths: {[key: string]: boolean} = {}; // e.g., A-106-January: true

  amount = 0;
  method = '';

  API = 'http://localhost:5000/api/maintenance';
  RESIDENT_API = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchResident();
  }

  // ================= FETCH RESIDENT =================
  fetchResident() {
    const email = localStorage.getItem("email");
    if (!email) { this.router.navigate(['/login']); return; }

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

  // ================= LOAD FLAT STATUS =================
loadFlatStatus() {
  if (!this.residentId) return;

  this.http.get<any>(`${this.API}/data?residentId=${this.residentId}`).subscribe({
    next: (res) => {
      // Prepare flatStatus: each flat's paid months
      this.flatStatus = this.flats.map(f => {
        const paidMonths: string[] = res.payments
          .filter((p: { block: string; flat: string; month: string }) =>
              p.block === f.block && p.flat === f.flat
          )
          .map((p: { block: string; flat: string; month: string }) => p.month);

        return { block: f.block, flat: f.flat, paidMonths: Array.from(new Set(paidMonths)) };
      });

      // Initialize selectedFlatMonths for checkboxes
      this.selectedFlatMonths = {};
      this.selectedFlats.forEach(f => {
        this.allMonths.forEach(m => {
          const key = f.block + '-' + f.flat + '-' + m;
          this.selectedFlatMonths[key] = false;
        });
      });

      this.calculateAmount();
    },
    error: () => {
      Swal.fire('Error','Failed to load flat payment status','error');
    }
  });
}
  // ================= CHECK IF MONTH IS PAID =================
  isPaid(block: string, flat: string, month: string): boolean {
    const fs = this.flatStatus.find(f => f.block === block && f.flat === flat);
    return fs ? fs.paidMonths.includes(month) : false;
  }

  // ================= ADD/REMOVE FLAT =================
  addFlat() {
    const remaining = this.flats.filter(f =>
      !this.selectedFlats.some(sf => sf.block === f.block && sf.flat === f.flat)
    );
    if (remaining.length > 0) {
      this.selectedFlats.push(remaining[0]);
      this.loadFlatStatus();
    }
  }

  removeFlat(index: number) {
    this.selectedFlats.splice(index, 1);
    this.loadFlatStatus();
  }
  // ================= PAY FULL YEAR =================
payFullYear() {
  const ratePerMonth = 1000; // Rate per month per flat
  const monthsInYear = 12;

  // Loop over all selected flats
  this.selectedFlats.forEach(f => {
    const fs = this.flatStatus.find(fl => fl.block === f.block && fl.flat === f.flat);
    if (!fs) return;

    this.allMonths.forEach(m => {
      const key = f.block + '-' + f.flat + '-' + m;

      // Only select months that are unpaid
      if (!fs.paidMonths.includes(m)) {
        this.selectedFlatMonths[key] = true;
      }
    });
  });

  // Recalculate amount
  this.calculateAmount();
}
  // ================= CALCULATE AMOUNT =================
 calculateAmount() {
  const ratePerMonth = 1000;
  let totalSelectedMonths = 0;

  for (const f of this.selectedFlats) {
    const fs = this.flatStatus.find(fl => fl.block === f.block && fl.flat === f.flat);
    if (!fs) continue;

    this.allMonths.forEach(m => {
      const key = f.block + '-' + f.flat + '-' + m;

      if (!this.selectedFlatMonths[key]) this.selectedFlatMonths[key] = false;

      // Count only if selected and not already paid
      if (this.selectedFlatMonths[key] && !fs.paidMonths.includes(m)) {
        totalSelectedMonths++;
      }
    });
  }

  this.amount = totalSelectedMonths * ratePerMonth;
}
  // ================= PAY =================
  payNow() {
    const selectedKeys = Object.keys(this.selectedFlatMonths).filter(k => this.selectedFlatMonths[k]);
    if (!selectedKeys.length) { Swal.fire('Error','Select at least one month','error'); return; }
    if (!this.method) { Swal.fire('Error','Select payment method','error'); return; }

    const flats: {block:string,flat:string}[] = [];
    const months: string[] = [];

    selectedKeys.forEach(k => {
      const [block, flat, month] = k.split('-');
      flats.push({ block, flat });
      months.push(month);
    });

    const data = { email: this.email, flats, months, amount: this.amount, method: this.method };

    this.http.post(`${this.API}/pay`, data).subscribe({
      next: () => {
        Swal.fire('Success','Payment done','success');
        this.method = '';
        this.selectedFlatMonths = {};
        this.loadFlatStatus();
      },
      error: () => Swal.fire('Error','Payment failed','error')
    });
  }

  // ================= UPI PAYMENT =================
  openUPI() {
    Swal.fire({
      title: 'UPI Payment',
      html: `Pay ₹${this.amount}`,
      imageUrl: 'assets/gpay-qr.png',
      confirmButtonText: 'I Paid'
    }).then(r => { if (r.isConfirmed) this.payNow(); });
  }

  // ================= CARD PAYMENT =================
  openCard() {
    Swal.fire({
      title: 'Card Payment',
      html: `<input class="swal2-input" placeholder="Card Number">
             <input class="swal2-input" placeholder="MM/YY">
             <input class="swal2-input" placeholder="CVV">`,
      confirmButtonText: 'Pay'
    }).then(r => { if (r.isConfirmed) this.payNow(); });
  }

  // ================= NAVBAR STATE =================
  menuOpen = false;
  servicesOpen = false;
  complaintsOpen = false;
  maintenanceOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleServices() { this.servicesOpen = !this.servicesOpen; }
  toggleComplaints() { this.complaintsOpen = !this.complaintsOpen; }
  toggleMaintenance() { this.maintenanceOpen = !this.maintenanceOpen; }

  // ================= LOGOUT =================
  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(r => { if(r.isConfirmed){ localStorage.clear(); this.router.navigate(['/login']); }});
  }
}
