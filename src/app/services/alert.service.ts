// src/app/services/alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private fire(message: string, icon: SweetAlertIcon, title?: string, showConfirmButton = false, timer = 1500) {
    Swal.fire({
      icon,
      title,
      text: message,
      showConfirmButton,
      timer
    });
  }

  success(message: string, title = 'Success') {
    this.fire(message, 'success', title);
  }

  error(message: string, title = 'Error') {
    this.fire(message, 'error', title);
  }

  info(message: string, title = 'Info') {
    this.fire(message, 'info', title);
  }

  warning(message: string, title = 'Warning') {
    this.fire(message, 'warning', title, true);
  }

  goodbye(name: string) {
    this.fire(`Goodbye, ${name}! 👋`, 'success');
  }

  loading(message = 'Please wait...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

  close() {
    Swal.close();
  }

  confirm(message: string, title = 'Are you sure?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }
}
