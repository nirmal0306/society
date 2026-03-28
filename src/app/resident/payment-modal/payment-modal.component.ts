import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

interface ResidentFlat {
  block: string;
  flat: string;
}

interface CardErrors {
  number?: string;
  expiry?: string;
  cvv?: string;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {
  @Input() selectedFlats: ResidentFlat[] = [];
  @Input() selectedFlatMonths: { [key: string]: boolean } = {};
  @Input() residentId!: string;
  @Input() amount: number = 0;

  @Output() closeModal = new EventEmitter<void>();
  @Output() onPaymentInitiate = new EventEmitter<any>();
  @Output() paymentSuccess = new EventEmitter<void>();

  selectedType: 'UPI' | 'Card' = 'UPI';

  upiId = '';
  selectedUpiProvider: 'phonepe' | 'gpay' | 'paytm' | null = null;
  upiErrors: string[] = [];
  isUpiTouched = false;

  showUpiPinScreen = false;
  enteredPin = '';
  pinDots = [1, 2, 3, 4, 5, 6];
  currentBank = 'HDFC BANK LTD';

  card = {
    number: '',
    expiry: '',
    cvv: ''
  };

  cardBrand: 'visa' | 'mastercard' | 'rupay' | null = null;
  cardErrors: CardErrors = {};

  isProcessing = false;
  API = 'http://localhost:5000/api/maintenance';

  isCardTouched = false;
  isExpiryTouched = false;
  isCvvTouched = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.resetUpiForm();
    this.resetCardForm();
  }

  switchType(type: 'UPI' | 'Card') {
    this.selectedType = type;
    if (type === 'UPI') {
      this.resetUpiForm();
    } else {
      this.resetCardForm();
    }
  }

  selectUpiProvider(provider: 'phonepe' | 'gpay' | 'paytm') {
    this.selectedUpiProvider = provider;
    setTimeout(() => {
      const input = document.querySelector('.upi-input') as HTMLInputElement;
      input?.focus();
    }, 100);
  }

  getUpiPlaceholder(): string {
    return this.selectedUpiProvider ? `${this.selectedUpiProvider}@upi` : 'example@upi';
  }

  validateUpiId() {
    this.upiErrors = [];
    const value = this.upiId.trim();

    if (!value) {
      this.upiErrors.push('UPI ID is required');
      return;
    }

    if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(value)) {
      this.upiErrors.push('Enter valid UPI ID');
      return;
    }

    if (value.length < 5 || value.length > 50) {
      this.upiErrors.push('UPI ID must be 5-50 characters');
    }
  }

  onFocusUpi() {
    this.isUpiTouched = true;
  }

  isUpiValid(): boolean {
    const value = this.upiId.trim();
    if (!value) return false;
    if (!this.selectedUpiProvider) return false;
    if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(value)) return false;
    return value.length >= 5 && value.length <= 50;
  }

  proceedToUpiPin() {
    if (!this.isUpiValid()) {
      Swal.fire('Error', 'Enter valid UPI ID', 'error');
      return;
    }

    this.showUpiPinScreen = true;
    this.enteredPin = '';
    this.setBankByProvider();

    setTimeout(() => {
      const pinInput = document.querySelector('.hidden-pin-input') as HTMLInputElement;
      pinInput?.focus();
    }, 200);
  }

  setBankByProvider() {
    const banks: Record<'phonepe' | 'gpay' | 'paytm', string> = {
      phonepe: 'YES BANK LTD',
      gpay: 'ICICI BANK LTD',
      paytm: 'AXIS BANK LTD'
    };

    this.currentBank = this.selectedUpiProvider
      ? banks[this.selectedUpiProvider]
      : 'HDFC BANK LTD';
  }

  addPinDigit(digit: string) {
    if (this.enteredPin.length < 6) {
      this.enteredPin += digit;
    }
  }

  deletePin() {
    this.enteredPin = this.enteredPin.slice(0, -1);
  }
  // Add property
showPin: boolean = false;

// Replace togglePinVisibility method
togglePinVisibility() {
  this.showPin = !this.showPin;
}

// Add this NEW method to show actual PIN visually
getVisiblePin(): string {
  if (this.showPin) {
    return this.enteredPin || '';
  } else {
    return '•'.repeat(this.enteredPin.length);
  }
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
    setTimeout(() => {
      this.processUpiPayment();
    }, 1000);
  }

  private processUpiPayment() {
    const email = this.getUserEmail();
    if (!email) return;

    const selectedKeys = Object.keys(this.selectedFlatMonths).filter(k => this.selectedFlatMonths[k]);

    const flats: any[] = [];
    const months: string[] = [];

    selectedKeys.forEach(k => {
      const [block, flat, month] = k.split('-');
      flats.push({ block, flat });
      months.push(month);
    });

    const paymentData = {
      residentId: this.residentId,
      email,
      flats,
      months,
      amount: this.amount * 1.18,
      method: 'UPI',
      upiDetails: {
        upiId: this.upiId.trim(),
        provider: this.selectedUpiProvider
      },
      status: 'success'
    };

    this.http.post(`${this.API}/pay`, paymentData).subscribe({
      next: () => {
        Swal.fire('Success', 'Payment Successful!', 'success');
        this.paymentSuccess.emit();
        this.closeModal.emit();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Payment failed', 'error');
      }
    });

    this.isProcessing = false;
  }

  selectCardBrand(brand: 'visa' | 'mastercard' | 'rupay') {
    this.cardBrand = brand;
  }

  validateCardNumber() {
    this.cardErrors.number = '';
    const num = this.card.number.replace(/\s/g, '');

    if (!num) this.cardErrors.number = 'Required';
    else if (num.length < 13 || num.length > 19) this.cardErrors.number = 'Invalid length';
  }

  validateExpiry() {
    this.cardErrors.expiry = '';
    if (!this.card.expiry) this.cardErrors.expiry = 'Required';
  }

  validateCvv() {
    this.cardErrors.cvv = '';
    if (!/^\d{3,4}$/.test(this.card.cvv)) this.cardErrors.cvv = 'Invalid CVV';
  }

  isCardFormValid(): boolean {
    this.validateCardNumber();
    this.validateExpiry();
    this.validateCvv();

    return !this.cardErrors.number &&
      !this.cardErrors.expiry &&
      !this.cardErrors.cvv &&
      !!this.cardBrand;
  }

  processCardPayment() {
    if (!this.isCardFormValid()) return;

    const email = this.getUserEmail();
    if (!email) return;

    this.isProcessing = true;
    const selectedKeys = Object.keys(this.selectedFlatMonths).filter(k => this.selectedFlatMonths[k]);

    const flats: any[] = [];
    const months: string[] = [];

    selectedKeys.forEach(k => {
      const [block, flat, month] = k.split('-');
      flats.push({ block, flat });
      months.push(month);
    });

    const paymentData = {
      residentId: this.residentId,
      email,
      flats,
      months,
      amount: this.amount * 1.18,
      method: 'Card',
      cardDetails: this.card,
      status: 'success'
    };

    this.http.post(`${this.API}/pay`, paymentData).subscribe({
      next: () => {
        Swal.fire('Success', 'Card Payment Successful', 'success');
        this.paymentSuccess.emit();
        this.closeModal.emit();
      },
      error: () => Swal.fire('Error', 'Payment failed', 'error'),
      complete: () => {
        this.isProcessing = false;
      }
    });
  }

  pay() {
    if (this.selectedType === 'UPI') {
      this.proceedToUpiPin();
    } else {
      this.processCardPayment();
    }
  }

  private getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

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

  onFocusCard() {
    this.isCardTouched = true;
  }

  onFocusExpiry() {
    this.isExpiryTouched = true;
  }

  onFocusCvv() {
    this.isCvvTouched = true;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
    this.card.number = value;
    this.validateCardNumber();
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.card.expiry = value;
    this.validateExpiry();
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


onPinPaste(event: any) {
  setTimeout(() => {
    this.onPinInput({ target: { value: event.target.value } });
  }, 10);
}

  cancel() {
    this.closeModal.emit();
  }
}
