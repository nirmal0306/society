import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-resident',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.css']
})
export class AddResidentComponent {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  blocks = ['A','B','C','D','E','F','G','H','I','J'];
  flats: string[] = [];

  resident = {
    name: '',
    email: '',
    mobile: '',
    flats: [{ block: '', flat: '' }]
  };

  imageBlob!: Blob;
  imagePreview: string | null = null;
  stream!: MediaStream;

  API_URL = 'http://localhost:5000/api/residents';

  constructor(private http: HttpClient, private router: Router) {
    this.generateFlats();
  }

  generateFlats() {
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 6; n++) {
        this.flats.push(`${f}0${n}`);
      }
    }
  }

  addFlat() {
    this.resident.flats.push({ block: '', flat: '' });
  }

  removeFlat(index: number) {
    this.resident.flats.splice(index, 1);
  }

  async startCamera() {
    // Validate required fields first
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire({
        icon: 'warning',
        title: 'Fill All Details',
        text: 'Please enter Name, Email, and Mobile before starting the camera.'
      });
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement as HTMLVideoElement;
      videoEl.srcObject = this.stream;
      videoEl.style.transform = 'scaleX(-1)'; // mirror view
      videoEl.play();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Camera Error',
        text: 'Camera access denied or not available'
      });
    }
  }


  captureImage() {
    // Validate required fields first
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire({
        icon: 'warning',
        title: 'Fill All Details',
        text: 'Please enter Name, Email, and Mobile before capturing face.'
      });
      return;
    }

    const video = this.video.nativeElement as HTMLVideoElement;
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;

    if (!video || !canvas) {
      Swal.fire('Error', 'Camera not initialized', 'error');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      Swal.fire('Error', 'Canvas not supported', 'error');
      return;
    }

    // Draw flipped video to get correct image
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Update preview immediately
    this.imagePreview = canvas.toDataURL('image/png');

    // Convert to blob for upload
    canvas.toBlob((blob: Blob | null) => {
      if (!blob) {
        Swal.fire('Error', 'Failed to capture image', 'error');
        return;
      }
      this.imageBlob = blob;
    }, 'image/png');

    // Stop camera
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    Swal.fire({
      icon: 'success',
      title: 'Captured',
      text: 'Face image captured successfully',
      timer: 1200,
      showConfirmButton: false
    });
  }


  addResident() {

    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Validation Error', 'Please fill all details', 'warning');
      return;
    }

    if (this.resident.flats.some(f => !f.block || !f.flat)) {
      Swal.fire('Validation Error', 'Select block and flat properly', 'warning');
      return;
    }

    if (!this.imageBlob) {
      Swal.fire('Error', 'Capture face image before submitting', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.resident.name);
    formData.append('email', this.resident.email);
    formData.append('mobile', this.resident.mobile);
    formData.append('flats', JSON.stringify(this.resident.flats));
    formData.append('photo', this.imageBlob, 'face.png');

    Swal.fire({
      title: 'Adding Resident...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Resident added successfully!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/list-residents']);
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to add resident', 'error');
      }
    });
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Do you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin-login']);
        });
      }
    });
  }
}
