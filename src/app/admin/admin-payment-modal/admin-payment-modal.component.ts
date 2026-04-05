import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

interface SecurityUser {
  _id: string;
  name: string;
  email: string;
}

interface CardErrors {
  number?: string;
  expiry?: string;
  cvv?: string;
}

@Component({
  selector: 'app-admin-payment-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin-payment-modal.component.html',
  styleUrls: ['./admin-payment-modal.component.css']
})
export class AdminPaymentModalComponent implements OnInit {
  // ===== INPUTS =====
  @Input() security!: SecurityUser;
  @Input() amount: number = 0;
  @Input() selectedMonths: string[] = [];

  // ===== OUTPUTS =====
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();

  // ===== COMMON STATE =====
  selectedType: 'UPI' | 'Card' = 'UPI';
  isProcessing = false;
  API = 'http://localhost:5000/api/salary';

  // ===== UPI =====
  upiId = '';
  selectedUpiProvider: 'phonepe' | 'gpay' | 'paytm' | null = null;
  upiErrors: string[] = [];
  isUpiTouched = false;
  showUpiPinScreen = false;
  enteredPin = '';
  currentBank = 'HDFC BANK LTD';
  showPin = false;

  // ===== CARD =====
  card = { number: '', expiry: '', cvv: '' };
  cardBrand: 'visa' | 'mastercard' | 'rupay' | null = null;
  cardErrors: CardErrors = {};
  isCardTouched = false;
  isExpiryTouched = false;
  isCvvTouched = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.resetUpiForm();
    this.resetCardForm();
  }

  // ===== COMMON METHODS =====
  switchType(type: 'UPI' | 'Card') {
    this.selectedType = type;
    type === 'UPI' ? this.resetUpiForm() : this.resetCardForm();
  }

  cancel() {
    this.closeModal.emit();
  }

  // ===== UPI METHODS =====
  selectUpiProvider(provider: 'phonepe' | 'gpay' | 'paytm') {
    this.selectedUpiProvider = provider;
    this.setBankByProvider();
  }

  setBankByProvider() {
    const banks: Record<'phonepe' | 'gpay' | 'paytm', string> = {
      phonepe: 'YES BANK LTD',
      gpay: 'ICICI BANK LTD',
      paytm: 'AXIS BANK LTD'
    };
    this.currentBank = this.selectedUpiProvider ? banks[this.selectedUpiProvider] : 'HDFC BANK LTD';
  }

  getUpiPlaceholder(): string {
    return this.selectedUpiProvider ? `${this.selectedUpiProvider}@upi` : 'example@upi';
  }

  onFocusUpi() {
    this.isUpiTouched = true;
  }

  validateUpiId() {
    this.upiErrors = [];
    const value = this.upiId.trim();
    if (!value) this.upiErrors.push('UPI ID required');
    else if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(value)) this.upiErrors.push('Invalid UPI ID');
  }

  isUpiValid(): boolean {
    const v = this.upiId.trim();
    return !!v && !!this.selectedUpiProvider && /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(v);
  }

  proceedToUpiPin() {
    if (!this.isUpiValid()) {
      Swal.fire('Error', 'Enter valid UPI ID', 'error');
      return;
    }
    this.showUpiPinScreen = true;
    this.enteredPin = '';
    this.setBankByProvider();
  }

  addPinDigit(digit: string) {
    if (this.enteredPin.length < 6) this.enteredPin += digit;
  }

  deletePin() {
    this.enteredPin = this.enteredPin.slice(0, -1);
  }

  togglePinVisibility() {
    this.showPin = !this.showPin;
  }

  getVisiblePin(): string {
    return this.showPin ? this.enteredPin : '•'.repeat(this.enteredPin.length);
  }

  onPinInput(event: any) {
    if (this.enteredPin.length >= 6) {
      this.enteredPin = this.enteredPin.substring(0, 6);
      event.target.value = this.enteredPin;
    }
  }
  submitUpiPin() {
  if (this.enteredPin.length !== 6) {
    Swal.fire('Error', 'Enter 6-digit PIN', 'error');
    return;
  }

  this.isProcessing = true;
  const paymentData = {
    securityId: this.security._id,
    name: this.security.name,
    email: this.security.email,
    months: this.selectedMonths,
    amount: this.amount,
    method: 'UPI',
    status: 'success',
    upiDetails: {   // <-- send UPI details
      upiId: this.upiId.trim(),
      provider: this.selectedUpiProvider
    }
  };


  this.http.post(`${this.API}/pay`, paymentData).subscribe({
    next: () => {
      Swal.fire('Success', 'Salary Paid', 'success');
      Swal.fire('Success','Salary paid successfully!','success');
      this.paymentSuccess.emit(paymentData);
      this.closeModal.emit();
    },
    error: () => Swal.fire('Error', 'Payment Failed', 'error'),
    complete: () => this.isProcessing = false
  });
}
  submitUpiPin1() {
    if (this.enteredPin.length !== 6) {
      Swal.fire('Error', 'Enter 6-digit PIN', 'error');
      return;
    }

    this.isProcessing = true;
    const paymentData = {
      securityId: this.security._id,
      name: this.security.name,
      email: this.security.email,
      months: this.selectedMonths,
      amount: this.amount,
      method: 'UPI',
      status: 'success'
    };

    this.http.post(`${this.API}/pay`, paymentData).subscribe({
      next: () => {
        Swal.fire('Success', 'Salary Paid', 'success');
        this.paymentSuccess.emit(paymentData);
        this.closeModal.emit();
      },
      error: () => Swal.fire('Error', 'Payment Failed', 'error'),
      complete: () => this.isProcessing = false
    });
  }

  // ===== CARD METHODS =====
  selectCardBrand(brand: 'visa' | 'mastercard' | 'rupay') {
    this.cardBrand = brand;
  }

  formatCardNumber(e: any) {
    let v = e.target.value.replace(/\D/g, '');
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.card.number = v;
  }

  formatExpiry(e: any) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    this.card.expiry = v;
  }

  onFocusCard() { this.isCardTouched = true; }
  onFocusExpiry() { this.isExpiryTouched = true; }
  onFocusCvv() { this.isCvvTouched = true; }

  validateCardNumber() {
    this.cardErrors.number = '';
    const num = this.card.number.replace(/\s/g, '');
    if (!num) this.cardErrors.number = 'Required';
    else if (num.length < 13 || num.length > 19) this.cardErrors.number = 'Invalid length';
  }

  validateExpiry() {
    this.cardErrors.expiry = this.card.expiry ? '' : 'Required';
  }

  validateCvv() {
    this.cardErrors.cvv = /^\d{3,4}$/.test(this.card.cvv) ? '' : 'Invalid CVV';
  }

  isCardFormValid(): boolean {
    this.validateCardNumber();
    this.validateExpiry();
    this.validateCvv();
    return !!this.card.number && !!this.card.expiry && !!this.card.cvv && !!this.cardBrand;
  }
  processCardPayment() {
  if (!this.isCardFormValid()) return;

  this.isProcessing = true;
  const paymentData = {
    securityId: this.security._id,
    name: this.security.name,
    email: this.security.email,
    months: this.selectedMonths,
    amount: this.amount,
    method: 'Card',
    status: 'success',
    cardDetails: {   // <-- send Card details
      number: this.card.number,
      expiry: this.card.expiry,
      cvv: this.card.cvv,
      brand: this.cardBrand
    }
  };

  this.http.post(`${this.API}/pay`, paymentData).subscribe({
    next: () => {
      Swal.fire('Success', 'Card Payment Done', 'success');
      this.paymentSuccess.emit(paymentData);
      this.closeModal.emit();
    },
    error: () => Swal.fire('Error', 'Payment Failed', 'error'),
    complete: () => this.isProcessing = false
  });
}
  processCardPayment1() {
    if (!this.isCardFormValid()) return;

    this.isProcessing = true;
    const paymentData = {
      securityId: this.security._id,
      name: this.security.name,
      email: this.security.email,
      months: this.selectedMonths,
      amount: this.amount,
      method: 'Card',
      status: 'success'
    };

    this.http.post(`${this.API}/pay`, paymentData).subscribe({
      next: () => {
        Swal.fire('Success', 'Card Payment Done', 'success');
        this.paymentSuccess.emit(paymentData);
        this.closeModal.emit();
      },
      error: () => Swal.fire('Error', 'Payment Failed', 'error'),
      complete: () => this.isProcessing = false
    });
  }

  isCardPreviewValid(): boolean {
    return !!this.card.number && !!this.cardBrand && !this.cardErrors.number;
  }

  getFormattedCardNumber(): string {
    return this.card.number || '**** **** **** ****';
  }

  getFormattedExpiry(): string {
    return this.card.expiry || 'MM/YY';
  }

  // ===== RESET FORMS =====
  private resetUpiForm() {
    this.upiId = '';
    this.selectedUpiProvider = null;
    this.upiErrors = [];
    this.showUpiPinScreen = false;
    this.enteredPin = '';
  }

  private resetCardForm() {
    this.card = { number: '', expiry: '', cvv: '' };
    this.cardBrand = null;
    this.cardErrors = {};
  }

  // ===== PAY =====
  pay() {
    this.selectedType === 'UPI' ? this.proceedToUpiPin() : this.processCardPayment();
  }
}
