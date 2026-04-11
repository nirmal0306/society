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
import emailjs from '@emailjs/browser';
import { API_URL } from '../../app.config';
interface ResidentFlat {
  block: string;
  flat: string;
}

interface FlatStatus {
  block: string;
  flat: string;
  paidMonths: string[];
  unpaidMonths: string[];
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
  pendingCount: number = 0;
  flatPendingMonths: { [key: string]: number } = {};
  flatPendingMonthNames: { [key: string]: string[] } = {};

showPendingDetails: boolean = false;
expandedFlat: string | null = null;

togglePendingDetails() {
  this.showPendingDetails = !this.showPendingDetails;
}

toggleFlatDetails(flatKey: string) {
  this.expandedFlat = this.expandedFlat === flatKey ? null : flatKey;
}

  API = 'http://localhost:5000/api/maintenance';
  // RESIDENT_API = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem("email");

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.fetchResident();
  }

loadMaintenanceData() {
  if (!this.residentId) return;

  this.http.get<any>(`${API_URL}/api/maintenance/data?residentId=${this.residentId}`).subscribe({
    next: (res) => {
      this.flatStatus = (res.flatStatus || []).map((f: any) => ({
        block: f.block,
        flat: f.flat,
        paidMonths: f.paidMonths || [],
        unpaidMonths: f.unpaidMonths || []
      }));

      this.pendingCount = 0;
      this.flatPendingMonths = {};
      this.flatPendingMonthNames = {};

      this.flatStatus.forEach((flat: any) => {
        const flatKey = `${flat.block}-${flat.flat}`;
        const pendingMonths = flat.unpaidMonths || [];

        this.flatPendingMonths[flatKey] = pendingMonths.length;
        this.flatPendingMonthNames[flatKey] = pendingMonths;
        this.pendingCount += pendingMonths.length;
      });

      this.calculateAmount();
    },
    error: () => {
      Swal.fire('Error', 'Failed to load maintenance data', 'error');
    }
  });
}
loadFlatStatus() {
  if (!this.residentId) return;

  this.http.get<any>(`${API_URL}/api/maintenance/data?residentId=${this.residentId}`).subscribe({
    next: (res) => {
      this.flatStatus = this.flats.map(f => {
        const matchedFlat = (res.flatStatus || []).find(
          (item: any) => item.block === f.block && item.flat === f.flat
        );

        return {
          block: f.block,
          flat: f.flat,
          paidMonths: matchedFlat?.paidMonths || [],
          unpaidMonths: matchedFlat?.unpaidMonths || []
        };
      });

      this.pendingCount = 0;
      this.flatPendingMonths = {};

      this.flatStatus.forEach((flat: FlatStatus) => {
        const flatKey = `${flat.block}-${flat.flat}`;
        const count = flat.unpaidMonths.length;
        this.flatPendingMonths[flatKey] = count;
        this.pendingCount += count;
      });

      this.selectedFlatMonths = {};
      this.selectedFlats.forEach(f => {
        this.allMonths.forEach(m => {
          const key = `${f.block}-${f.flat}-${m}`;
          this.selectedFlatMonths[key] = false;
        });
      });

      this.calculateAmount();
    },
    error: () => Swal.fire('Error', 'Failed to load flat payment status', 'error')
  });
}

calculatePendingMonths(data: any) {
  this.pendingCount = 0;
  this.flatPendingMonths = {};

  if (!data?.flatStatus) return;

  data.flatStatus.forEach((flat: any) => {
    const flatKey = `${flat.block}-${flat.flat}`;
    const count = (flat.unpaidMonths || []).length;
    this.flatPendingMonths[flatKey] = count;
    this.pendingCount += count;
  });
}

  fetchResident() {
    const email = localStorage.getItem("email");

    this.http.get<any>(`${API_URL}/api/residents/profile/${email}`).subscribe({
      next: (res) => {
        this.name = res.name;
        this.email = res.email;
        this.flats = res.flats || [];
        this.selectedFlats = [...this.flats];
        this.residentId = res._id;
        this.loadMaintenanceData();
      },
      error: () => Swal.fire("Error", "Profile load failed", "error")
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
  
  private loadProfileData(email: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.http.get<any>(`${API_URL}/api/residents/profile/${email}`).subscribe({
      next: (res) => resolve(res),
      error: () => reject(new Error('Profile load failed'))
    });
  });
}

async sendReceiptEmail(
  residentEmail: string,
  amount: number,
  method: string,
  selectedFlatMonths: any
) {
  try {
    const profile = await this.loadProfileData(residentEmail);
    console.log(residentEmail);

    const selectedKeys = Object.keys(selectedFlatMonths || {}).filter(
      key => selectedFlatMonths[key]
    );

    if (selectedKeys.length === 0) {
      Swal.fire('Error', 'No data for receipt', 'error');
      return;
    }

    const flatDetails = selectedKeys.map((key: string) => {
      const parts = key.split('-');
      return {
        block: parts[0] || '',
        flat: parts[1] || '',
        month: parts.slice(2).join('-') || ''
      };
    });

    const safeAmount = Number(amount) || 0;
    const taxRate = 0.18;
    const taxAmount = safeAmount * taxRate;
    const totalAmount = safeAmount + taxAmount;

    const receiptData = {
      residentName: profile?.name || 'Resident',
      residentEmail: profile?.email || residentEmail,
      mobile: profile?.mobile || '',
      block: flatDetails[0]?.block || '',
      flat: flatDetails[0]?.flat || '',
      months: flatDetails.map(f => `${f.month} (${f.block}-${f.flat})`).join(', '),
      flatsCount: flatDetails.length,
      amount: safeAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      paymentMethod: method,
      invoiceNo: 'MAINT-' + Date.now().toString().slice(-6),
      transactionDate: new Date().toLocaleString('en-IN')
    };

    const templateParams = {
      to_email: receiptData.residentEmail,
      resident_name: receiptData.residentName,
      resident_email: receiptData.residentEmail,
      mobile: receiptData.mobile,
      block: receiptData.block,
      flat: receiptData.flat,
      months: receiptData.months,
      flats_count: String(receiptData.flatsCount),
      amount: receiptData.amount,
      tax_amount: receiptData.taxAmount,
      total_amount: receiptData.totalAmount,
      payment_method: receiptData.paymentMethod,
      invoice_no: receiptData.invoiceNo,
      transaction_date: receiptData.transactionDate
    };
    console.log("📧 Sending to:", templateParams.to_email);
    await emailjs.send(
      'service_qi5lelt',
      'template_jha2c4k',
      templateParams,
      'glnahPLXPdrZK_OcP'
    );

    // Swal.fire('Success', 'Receipt emailed successfully!', 'success');
    console.log('Receipt emailed successfully!');

  } catch (err) {
    console.error('Email sending failed:', err);
    Swal.fire('Error', 'Failed to send email', 'error');
  }
}
private async downloadReceipt(selectedFlatMonths: any, amount: number, method: string) {
  const email = localStorage.getItem('email');
  if (!email) return;

  let element: HTMLElement | null = null;

  try {
    const profile = await this.loadProfileData(email);

    const selectedKeys = Object.keys(selectedFlatMonths || {}).filter(k => selectedFlatMonths[k]);

    // ❗ Prevent crash if nothing selected
    if (selectedKeys.length === 0) {
      Swal.fire("Error", "No data for receipt", "error");
      return;
    }

    const flatDetails = selectedKeys.map((k: string) => {
      const [block, flat, month] = k.split('-');
      return { block, flat, month };
    });

    // Ensure amount is number
    const safeAmount = Number(amount) || 0;

    const receiptData = {
      residentName: profile?.name || 'Resident',
      residentEmail: profile?.email || email,
      mobile: profile?.mobile || '',
      block: flatDetails[0]?.block || '',
      flat: flatDetails[0]?.flat || '',
      months: flatDetails.map(f => `${f.month} (${f.block}-${f.flat})`).join(', '),
      flatsCount: flatDetails.length,
      amount: safeAmount.toFixed(2),
      taxAmount: (safeAmount * 0.18).toFixed(2),
      totalAmount: (safeAmount * 1.18).toFixed(2),
      paymentMethod: method,
      invoiceNo: 'MAINT-' + Date.now().toString().slice(-6),
      transactionDate: new Date().toLocaleString('en-IN')
    };

    // Create element safely
    element = document.createElement('div');
    element.innerHTML = this.getReceiptHtml(receiptData);

    document.body.appendChild(element);

    // Smart filename
    const flatPart = [...new Set(flatDetails.map(f => `${f.block}-${f.flat}`))].join('_');
    const monthPart = [...new Set(flatDetails.map(f => f.month))].join('_');

    const filename = (flatPart || monthPart)
      ? `${[flatPart, monthPart].filter(Boolean).join('-')}-Maintenance.pdf`
      : `Maintenance-${Date.now()}.pdf`;

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

    // FIX import issue
    const html2pdf = (await import('html2pdf.js')).default;

    await html2pdf().set(opt).from(element).save();

  } catch (error) {
    console.error('Receipt error:', error);
    Swal.fire("Error", "Receipt generation failed", "error");
  } finally {
    // ALWAYS cleanup (even on error)
    if (element) {
      document.body.removeChild(element);
    }
  }
}

  private getReceiptHtml(data: any): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Maintenance Invoice</title>
</head>
<body style="margin:0; padding:0; background:#ffffff; font-family:Arial, sans-serif; color:#333333; -webkit-print-color-adjust:exact; print-color-adjust:exact;">

  <div id="invoice"
       style="width:186mm; margin:0 auto; padding:10mm; box-sizing:border-box; background:#ffffff; page-break-inside:avoid; break-inside:avoid;">

    <!-- Top Brand -->
    <div style="text-align:center; margin-bottom:12px; padding-bottom:8px; border-bottom:4px solid #18d0b2; page-break-inside:avoid; break-inside:avoid;">
      <div style="font-size:35px; font-weight:800; color:#18d0b2; line-height:1.1;">MyGate</div>
    </div>

    <!-- Invoice Header -->
    <div style="border-bottom:3px solid #23459a; padding:10px 0 14px 0; margin-bottom:18px; page-break-inside:avoid; break-inside:avoid;">
      <table style="width:100%; border-collapse:collapse;">
        <tr style="page-break-inside:avoid; break-inside:avoid;">
          <td style="width:30%; vertical-align:top; font-size:17px; font-weight:700; color:#23459a;">
            ⊙ Krish Homes
          </td>

          <td style="width:40%; vertical-align:top; text-align:center;">
            <div style="font-size:24px; font-weight:800; color:#23459a; line-height:1.1;">INVOICE</div>
            <div style="font-size:12px; color:#666666; margin-top:8px;">
              Invoice #: ${data.invoiceNo}
            </div>
          </td>

          <td style="width:30%; vertical-align:top; text-align:right; font-size:11px; color:#666666; line-height:1.45;">
            Krish Homes 2, lambha<br>
            Ahmedabad, ST 385240<br>
            Phone: (079) 325-5241
          </td>
        </tr>
      </table>
    </div>

    <!-- Billed To -->
    <div style="background:#eef4fc; border-left:5px solid #23459a; border-radius:0 8px 8px 0; padding:16px 18px; margin-bottom:16px; page-break-inside:avoid; break-inside:avoid;">
      <div style="font-size:12px; font-weight:700; color:#23459a; text-transform:uppercase; margin-bottom:12px;">
        BILLED TO
      </div>

      <div style="font-size:20px; font-weight:800; color:#222222; margin-bottom:10px;">
        ${data.residentName}
      </div>

      <div style="font-size:12px; color:#23459a; margin-bottom:8px;">
        <span style="display:inline-block; width:18px;">📧</span>
        <span style="font-family:monospace;">${data.residentEmail}</span>
      </div>

      <div style="font-size:12px; color:#23459a; margin-bottom:8px;">
        <span style="display:inline-block; width:18px;">📱</span>
        <span style="font-family:monospace;">${data.mobile}</span>
      </div>

      <div style="font-size:12px; color:#555555; margin-bottom:14px;">
        Block ${data.block}, Flat ${data.flat}
      </div>

      <div style="background:#f2fbff; border-left:4px solid #23459a; border-radius:4px; padding:10px 12px; font-size:12px; color:#1789a7;">
        <strong>Selected Months:</strong> ${data.months}
      </div>
    </div>

    <!-- Frequency Key -->
    <div style="background:#f7edc9; border-left:5px solid #f0a000; border-radius:0 6px 6px 0; padding:14px 16px; margin-bottom:16px; page-break-inside:avoid; break-inside:avoid;">
      <div style="font-size:13px; font-weight:700; color:#d88400; margin-bottom:10px;">
        Frequency Key
      </div>
      <div style="font-size:11px; color:#995f00; line-height:1.65;">
        AN–Annually | 6M–6 Months | 3M–3 Months | MO–Monthly | B1–Bi-Monthly | WK–Weekly
      </div>
    </div>

    <!-- Work Table -->
    <div style="page-break-inside:avoid; break-inside:avoid; margin-bottom:16px;">
      <table style="width:100%; border-collapse:collapse; page-break-inside:avoid;">
        <tr style="page-break-inside:avoid; break-inside:avoid;">
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:26%; border-right:1px solid rgba(255,255,255,0.15);">WORK DONE</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:15%; border-right:1px solid rgba(255,255,255,0.15);">FREQUENCY</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:31%; border-right:1px solid rgba(255,255,255,0.15);">DESCRIPTION</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:12%; border-right:1px solid rgba(255,255,255,0.15);">UNIT</th>
          <th style="background:#23459a; color:#ffffff; padding:14px 16px; font-size:12px; text-align:left; font-weight:700; width:16%;">AMOUNT</th>
        </tr>

        <tr style="page-break-inside:avoid; break-inside:avoid;">
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top; font-weight:700; line-height:1.35;">
            Maintenance<br>Service
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top;">
            MO
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top; line-height:1.45;">
            Monthly maintenance for ${data.flatsCount} flat(s)
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top; line-height:1.45;">
            ${data.flatsCount}<br>Flats
          </td>
          <td style="padding:14px 16px; font-size:12px; border-bottom:1px solid #ececec; vertical-align:top; text-align:right; font-weight:700; font-family:monospace; color:#23459a;">
            ₹${data.amount}
          </td>
        </tr>
      </table>
    </div>

    <!-- Equipment Charge -->
    <div style="background:#dbe8f9; border-left:5px solid #23459a; border-radius:0 6px 6px 0; padding:14px 16px; margin-bottom:18px; page-break-inside:avoid; break-inside:avoid;">
      <span style="font-size:12px; font-weight:700; color:#23459a;">EQUIPMENT CHARGE</span>
      <span style="font-size:12px; color:#6b7280; margin-left:10px;">(included in total)</span>
    </div>

    <!-- Footer + Total in Same Line -->
    <div style="page-break-inside:avoid; break-inside:avoid;">
      <table style="width:100%; border-collapse:collapse; page-break-inside:avoid;">
        <tr style="page-break-inside:avoid; break-inside:avoid;">

          <!-- Left footer block -->
          <td style="width:53%; vertical-align:top; padding-right:14px;">
            <div style="background:#f7f9fc; border-radius:10px; padding:22px 18px; text-align:center; height:170px; box-sizing:border-box; page-break-inside:avoid; break-inside:avoid;">
              <div style="font-size:16px; color:#23459a; font-weight:800; margin-bottom:14px;">
                Thank you for choosing our services!
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

          <!-- Right totals block -->
          <td style="width:47%; vertical-align:top;" align="right">
            <div style="height:170px; box-sizing:border-box; page-break-inside:avoid; break-inside:avoid;">
              <table style="width:100%; max-width:310px; height:170px; border-collapse:collapse; table-layout:fixed; page-break-inside:avoid;">
                <tr style="height:56px;">
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; font-weight:800; color:#333333; width:58%; vertical-align:middle;">
                    SUB-TOTAL
                  </td>
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; text-align:right; font-weight:800; font-family:monospace; color:#333333; vertical-align:middle;">
                    ₹${data.amount}
                  </td>
                </tr>

                <tr style="height:56px;">
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; font-weight:800; color:#333333; vertical-align:middle;">
                    TAX (18%)
                  </td>
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f8f8f8; font-size:13px; text-align:right; font-weight:800; font-family:monospace; color:#333333; vertical-align:middle;">
                    ₹${data.taxAmount}
                  </td>
                </tr>

                <tr style="height:58px;">
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f7edc9; font-size:13px; font-weight:800; color:#333333; vertical-align:middle;">
                    TOTAL
                  </td>
                  <td style="padding:0 18px; border:1px solid #d8d8d8; background:#f7edc9; font-size:13px; text-align:right; font-weight:800; font-family:monospace; color:#333333; vertical-align:middle;">
                    ₹${data.totalAmount}
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`;
}

handlePaymentSuccess(data: any) {
  console.log("Payment Success:", data);
  this.showPaymentModal = false;
  this.loadMaintenanceData();

  Swal.fire({
    title: 'Payment Successful!',
    text: 'Receipt will be downloaded & emailed',
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  }).then(() => {
    this.sendReceiptEmail(this.email, data.amount, data.method, data.selectedFlatMonths);
    this.downloadReceipt(data.selectedFlatMonths, data.amount, data.method);
  });
}
}
