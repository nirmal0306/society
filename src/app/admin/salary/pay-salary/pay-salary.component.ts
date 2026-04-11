import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPaymentModalComponent } from '../../admin-payment-modal/admin-payment-modal.component';
import { Router, RouterModule } from '@angular/router';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';
import emailjs from '@emailjs/browser';
import { API_URL } from '../../../app.config';


interface SecurityUser {
  _id: string;
  name: string;
  email: string;
}

interface PaidStatus {
  securityId: string;
  name: string;
  email: string;
  paidMonths: string[];
  unpaidMonths: string[];
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
  pendingSalaryCount: number = 0;
  securityPendingMonths: { [key: string]: number } = {};
  securityPendingMonthNames: { [key: string]: string[] } = {};

  showSalaryPendingDetails: boolean = false;
  expandedSecurityId: string | null = null;

   // Add these new properties
  emailjsService = 'service_cfrxlbz';
  emailjsTemplate = 'template_v6nyaek'; // Use same template or create salary-specific
  emailjsPublicKey = 'OtcW9C_RrRcT4XiSn';
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
  toggleSalaryPendingDetails(): void {
    this.showSalaryPendingDetails = !this.showSalaryPendingDetails;
  }

  toggleSecurityDetails(securityId: string): void {
    this.expandedSecurityId = this.expandedSecurityId === securityId ? null : securityId;
  }
  getCurrentMonthIndex(): number {
  return new Date().getMonth();
}

isFutureMonth(month: string): boolean {
  return this.allMonths.indexOf(month) > this.getCurrentMonthIndex();
}
 isMonthDisabled(securityId: string, month: string): boolean {
  return this.isFutureMonth(month) || this.isMonthPaid(securityId, month);
}
  loadSecurityUsers(): void {
  this.http.get<SecurityUser[]>(`${API_URL}/api/security`).subscribe({
    next: (res) => {
      this.securityList = Array.isArray(res) ? res : [];
      this.calculatePendingSalaryData(); // ← ADD THIS
    },
    error: () => Swal.fire('Error', 'Failed to load security users', 'error')
  });
}

loadPaidMonths(): void {
  this.http.get<PaidStatus[]>(`${API_URL}/api/salary/paid`).subscribe({
    next: (res) => {
      this.securityStatus = Array.isArray(res) ? res : [];
      this.calculatePendingSalaryData(); // ← ADD THIS
    },
    error: () => Swal.fire('Error', 'Failed to load paid months', 'error')
  });
}
getMonthsTillCurrent(): string[] {
  const currentMonthIndex = new Date().getMonth(); // April = 3 (0-indexed)
  return this.allMonths.slice(0, currentMonthIndex + 1); // ["January", "February", "March", "April"]
}
calculatePendingSalaryData(): void {
  this.pendingSalaryCount = 0;
  this.securityPendingMonths = {};
  this.securityPendingMonthNames = {};

  const monthsTillCurrent = this.getMonthsTillCurrent();

  this.securityStatus.forEach((status) => {
    // Only consider months up to current month
    const relevantUnpaidMonths = status.unpaidMonths.filter(month =>
      monthsTillCurrent.includes(month)
    );

    const unpaidCount = relevantUnpaidMonths.length;

    if (unpaidCount > 0) {
      this.securityPendingMonths[status.securityId] = unpaidCount;
      this.securityPendingMonthNames[status.securityId] = relevantUnpaidMonths;
      this.pendingSalaryCount += unpaidCount;
    }
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
  // Load security profile data
private async loadProfileData(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get<any>(`${API_URL}/api/security/profile/${email}`).subscribe({
      next: (res) => resolve(res),
      error: () => reject(new Error('Profile load failed'))
    });
  });
}

// Send salary receipt email to security AND admin
async sendSalaryReceiptEmail(
  securityEmail: string,
  securityName: string,
  amount: number,
  method: string,
  selectedMonths: string[],
  securityId: string
) {
  try {
    const profile = await this.loadProfileData(securityEmail);

    // Admin email from localStorage
    const adminEmail = localStorage.getItem('email') || '';

    if (selectedMonths.length === 0) {
      Swal.fire('Error', 'No months selected for receipt', 'error');
      return;
    }

    const safeAmount = Number(amount) || 0;
    const taxRate = 0.18;
    const taxAmount = safeAmount * taxRate;
    const totalAmount = safeAmount;

    const receiptData = {
      securityName: securityName || profile?.name || 'Security Guard',
      securityEmail: profile?.email || securityEmail,
      mobile: profile?.mobile || '',
      months: selectedMonths.join(', '),
      monthsCount: selectedMonths.length,
      amount: safeAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: method,
      invoiceNo: 'SALARY-' + Date.now().toString().slice(-6),
      transactionDate: new Date().toLocaleString('en-IN')
    };

    const templateParams = {
      to_email: receiptData.securityEmail,
      security_name: receiptData.securityName,
      security_email: receiptData.securityEmail,
      mobile: receiptData.mobile,
      months: receiptData.months,
      months_count: String(receiptData.monthsCount),
      amount: receiptData.amount,
      total_amount: receiptData.totalAmount,
      payment_method: receiptData.paymentMethod,
      invoice_no: receiptData.invoiceNo,
      transaction_date: receiptData.transactionDate
    };

    console.log("📧 Sending salary receipt to:", templateParams.to_email);

    // Send to Security
    await emailjs.send(
      this.emailjsService,
      this.emailjsTemplate,
      templateParams,
      this.emailjsPublicKey
    );

    // Send copy to Admin (different template params for admin)
    if (adminEmail && adminEmail !== securityEmail) {
      const adminTemplateParams = {
        ...templateParams,
        to_email: adminEmail,
        security_name: `Salary Receipt for ${receiptData.securityName}`,
        subject_prefix: 'SENT TO SECURITY: '
      };

      console.log("📧 Admin copy to:", adminEmail);
      await emailjs.send(
        this.emailjsService,
        this.emailjsTemplate, // Use same template or create admin copy template
        adminTemplateParams,
        this.emailjsPublicKey
      );
    }

    console.log('✅ Salary receipt emailed successfully!');

  } catch (err) {
    console.error('Email sending failed:', err);
    Swal.fire('Error', 'Failed to send salary receipt email', 'error');
  }
}

// Download salary receipt
private async downloadSalaryReceipt(
  securityName: string,
  securityEmail: string,
  amount: number,
  method: string,
  selectedMonths: string[]
) {
  let element: HTMLElement | null = null;

  try {
    const profile = await this.loadProfileData(securityEmail);

    if (selectedMonths.length === 0) {
      Swal.fire("Error", "No months selected for receipt", "error");
      return;
    }

    const safeAmount = Number(amount) || 0;
    const receiptData = {
      securityName: securityName || profile?.name || 'Security Guard',
      securityEmail: profile?.email || securityEmail,
      mobile: profile?.mobile || '',
      months: selectedMonths.join(', '),
      monthsCount: selectedMonths.length,
      amount: safeAmount.toFixed(2),
      // taxAmount: (safeAmount * 0.18).toFixed(2),
      totalAmount: (safeAmount).toFixed(2),
      paymentMethod: method,
      invoiceNo: 'SALARY-' + Date.now().toString().slice(-6),
      transactionDate: new Date().toLocaleString('en-IN')
    };

    // Create receipt element
    element = document.createElement('div');
    element.innerHTML = this.getSalaryReceiptHtml(receiptData);
    document.body.appendChild(element);

    // Smart filename
    const monthPart = selectedMonths.slice(0, 2).join('_');
    const filename = `Salary-${securityName.replace(/\s+/g, '_')}-${monthPart || 'Payment'}.pdf`;

    const opt: any = {
      margin: [15, 15, 15, 15],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    const html2pdf = (await import('html2pdf.js')).default;
    await html2pdf().set(opt).from(element).save();

  } catch (error) {
    console.error('Salary receipt error:', error);
    Swal.fire("Error", "Salary receipt generation failed", "error");
  } finally {
    if (element) {
      document.body.removeChild(element);
    }
  }
}

// Salary receipt HTML template
private getSalaryReceiptHtml(data: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Salary Receipt</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:Arial, sans-serif; color:#333333; -webkit-print-color-adjust:exact; print-color-adjust:exact;">
  <div id="invoice" style="width:186mm; margin:0 auto; padding:10mm; box-sizing:border-box; background:#ffffff;">

    <!-- Top Brand -->
    <div style="text-align:center; margin-bottom:12px; padding-bottom:8px; border-bottom:4px solid #18d0b2;">
      <div style="font-size:35px; font-weight:800; color:#18d0b2; line-height:1.1;">Krish Homes</div>
    </div>

    <!-- Invoice Header -->
    <div style="border-bottom:3px solid #23459a; padding:10px 0 14px 0; margin-bottom:18px;">
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="width:30%; vertical-align:top; font-size:17px; font-weight:700; color:#23459a;">
            ⊙ Security Payroll
          </td>
          <td style="width:40%; vertical-align:top; text-align:center;">
            <div style="font-size:24px; font-weight:800; color:#23459a; line-height:1.1;">SALARY RECEIPT</div>
            <div style="font-size:12px; color:#666666; margin-top:8px;">
              Receipt #: ${data.invoiceNo}
            </div>
          </td>
          <td style="width:30%; vertical-align:top; text-align:right; font-size:11px; color:#666666;">
            Krish Homes 2, Lambha<br>
            Ahmedabad, Gujarat 382449<br>
            Phone: (079) 325-5241
          </td>
        </tr>
      </table>
    </div>

    <!-- Billed To -->
    <div style="background:#eef4fc; border-left:5px solid #23459a; border-radius:0 8px 8px 0; padding:16px 18px; margin-bottom:16px;">
      <div style="font-size:12px; font-weight:700; color:#23459a; text-transform:uppercase; margin-bottom:12px;">
        PAID TO
      </div>
      <div style="font-size:20px; font-weight:800; color:#222222; margin-bottom:10px;">
        ${data.securityName}
      </div>
      <div style="font-size:12px; color:#23459a; margin-bottom:8px;">
        <span style="display:inline-block; width:18px;">📧</span>
        <span style="font-family:monospace;">${data.securityEmail}</span>
      </div>
      <div style="font-size:12px; color:#23459a; margin-bottom:14px;">
        <span style="display:inline-block; width:18px;">📱</span>
        <span style="font-family:monospace;">${data.mobile}</span>
      </div>
      <div style="background:#f2fbff; border-left:4px solid #23459a; border-radius:4px; padding:10px 12px; font-size:12px; color:#1789a7;">
        <strong>Salary for:</strong> ${data.months}
      </div>
    </div>

    <!-- Work Table -->
    <div style="margin-bottom:16px;">
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:40%; border-right:1px solid rgba(255,255,255,0.15);">DESCRIPTION</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:20%; border-right:1px solid rgba(255,255,255,0.15);">MONTHS</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:20%; border-right:1px solid rgba(255,255,255,0.15);">RATE</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:right; font-weight:700; width:20%;">AMOUNT</th>
        </tr>
        <tr>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top; font-weight:700;">
            Monthly Salary
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top;">
            ${data.monthsCount} months
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top;">
            ₹8,000/month
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; text-align:right; font-weight:700; font-family:monospace; color:#23459a;">
            ₹${data.amount}
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer + Total -->
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="width:55%; vertical-align:top; padding-right:14px;">
          <div style="background:#f7f9fc; border-radius:10px; padding:22px 18px; text-align:center;">
            <div style="font-size:16px; color:#23459a; font-weight:800; margin-bottom:14px;">
              Thank you for your service!
            </div>
            <div style="font-size:12px; color:#666666; margin:8px 0; font-weight:700;">
              Payment Method: ${data.paymentMethod}
            </div>
            <div style="font-size:12px; color:#666666; margin:8px 0; font-weight:700;">
              Transaction Date: ${data.transactionDate}
            </div>
            <div style="font-size:11px; color:#999999; margin-top:18px; font-style:italic;">
              Computer-generated receipt. No signature required.
            </div>
          </div>
        </td>
        <td style="width:45%; vertical-align:top;" align="right">
          <table style="width:100%; max-width:280px; border-collapse:collapse;">
            <tr>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; font-weight:800; color:#333333; width:60%; vertical-align:middle;">SUB-TOTAL</td>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; text-align:right; font-weight:800; font-family:monospace;">₹${data.amount}</td>
            </tr>
            <tr>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; font-weight:800; color:#333333; vertical-align:middle;">TAX (18%)</td>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; text-align:right; font-weight:800; font-family:monospace;">₹${data.taxAmount}</td>
            </tr>
            <tr>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f7edc9; font-size:13px; font-weight:800; color:#333333; vertical-align:middle;">TOTAL</td>
              <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f7edc9; font-size:13px; text-align:right; font-weight:800; font-family:monospace;">₹${data.totalAmount}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}
  handlePaymentSuccess(data: any): void {
  console.log('✅ Salary Paid:', data);

  const paidSecurity = this.selectedSecurity;
  const selectedMonthsArray = this.getSelectedMonthsArray();

  if (!paidSecurity) {
    Swal.fire('Error', 'Security details not found', 'error');
    return;
  }

  this.showPaymentModal = false;

  Swal.fire({
    title: 'Payment Successful!',
    text: 'Receipt will be downloaded & emailed to security + admin',
    icon: 'success',
    timer: 2500,
    showConfirmButton: false
  }).then(() => {
    this.sendSalaryReceiptEmail(
      paidSecurity.email,
      paidSecurity.name,
      data.amount,
      data.method || 'Cash',
      selectedMonthsArray,
      paidSecurity._id
    );

    this.downloadSalaryReceipt(
      paidSecurity.name,
      paidSecurity.email,
      data.amount,
      data.method || 'Cash',
      selectedMonthsArray
    );
  });

  this.selectedSecurity = null;
  this.selectedMonths = {};
  this.amount = 0;
  this.loadPaidMonths();
}
}
