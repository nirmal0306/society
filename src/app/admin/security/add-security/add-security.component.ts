// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-add-security',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
//   templateUrl: './add-security.component.html',
//   styleUrls: ['./add-security.component.css']
// })
// export class AddSecurityComponent {

//   @ViewChild('video') video!: ElementRef;
//   @ViewChild('canvas') canvas!: ElementRef;

//   security = {
//     name: '',
//     email: '',
//     mobile: '',
//     shift: ''
//   };

//   shifts: string[] = ['Morning', 'Afternoon', 'Night'];

//   imageBlob!: Blob;
//   imagePreview: string | null = null;
//   stream!: MediaStream;

//   API_URL = 'http://localhost:5000/api/security';

//   constructor(private http: HttpClient, private router: Router) {}

//   async startCamera() {
//     if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
//       Swal.fire('Validation', 'Fill all details before starting the camera', 'warning');
//       return;
//     }

//     try {
//       this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const videoEl = this.video.nativeElement as HTMLVideoElement;
//       videoEl.srcObject = this.stream;
//       videoEl.style.transform = 'scaleX(-1)';
//       videoEl.play();
//     } catch (err) {
//       Swal.fire('Camera Error', 'Unable to access camera', 'error');
//     }
//   }

//   captureImage() {
//     if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
//       Swal.fire('Validation', 'Fill all details before capturing', 'warning');
//       return;
//     }

//     const video = this.video.nativeElement as HTMLVideoElement;
//     const canvas = this.canvas.nativeElement as HTMLCanvasElement;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.save();
//     ctx.scale(-1, 1); // mirror
//     ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
//     ctx.restore();

//     this.imagePreview = canvas.toDataURL('image/png');

//     canvas.toBlob((blob: Blob | null) => {
//       if (!blob) {
//         Swal.fire('Error', 'Failed to capture image', 'error');
//         return;
//       }
//       this.imageBlob = blob;
//     }, 'image/png');

//     if (this.stream) {
//       this.stream.getTracks().forEach(track => track.stop());
//     }

//     Swal.fire({ icon: 'success', title: 'Captured', timer: 1200, showConfirmButton: false });
//   }

//   addSecurity() {
//     if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
//       Swal.fire('Validation Error', 'Fill all details', 'warning');
//       return;
//     }

//     if (!this.imageBlob) {
//       Swal.fire('Error', 'Capture photo before submitting', 'error');
//       return;
//     }

//     const formData = new FormData();
//     Object.entries(this.security).forEach(([key, value]) => formData.append(key, value));
//     formData.append('photo', this.imageBlob, 'face.png');

//     Swal.fire({ title: 'Adding Security...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

//     this.http.post(this.API_URL, formData).subscribe({
//       next: () => {
//         Swal.fire({ icon: 'success', title: 'Security Added', timer: 1500, showConfirmButton: false })
//           .then(() => this.router.navigate(['/list-securities']));
//       },
//       error: () => Swal.fire('Error', 'Failed to add security', 'error')
//     });
//   }

//   logout() {
//     Swal.fire({
//       title: 'Logout?',
//       text: 'Do you want to logout?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'Cancel'
//     }).then(result => {
//       if (result.isConfirmed) {
//         localStorage.clear();
//         Swal.fire({ icon: 'success', title: 'Logged Out', timer: 1200, showConfirmButton: false })
//           .then(() => this.router.navigate(['/admin-login']));
//       }
//     });
//   }
// }

import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-add-security',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-security.component.html',
  styleUrls: ['./add-security.component.css']
})
export class AddSecurityComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  security = {
    name: '',
    email: '',
    mobile: '',
    shift: ''
  };

  shifts: string[] = ['Morning', 'Afternoon', 'Night'];

  imageBlob!: Blob;
  imagePreview: string | null = null;
  stream!: MediaStream;

  // ✅ REQUIRED FOR FACE LOGIN
  faceDescriptor: number[] = [];
  modelsLoaded = false;

  API_URL = 'http://localhost:5000/api/security';

  constructor(private http: HttpClient, private router: Router) {}

  /* ================= INIT ================= */

  async ngOnInit() {
    await this.loadModels();
  }


  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  maintenanceOpen = false;
  noticeOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleServices() {
    this.servicesOpen = !this.servicesOpen;
  }

  toggleResidents() {
    this.residentsOpen = !this.residentsOpen;
  }

  toggleSecurity() {
    this.securityOpen = !this.securityOpen;
  }

  toggleVisitors() {
  this.visitorsOpen = !this.visitorsOpen;
  }

  toggleEvent(){
    this.eventOpen = !this.eventOpen;
  }

  toggleMaintenance(){
    this.maintenanceOpen = !this.maintenanceOpen;
  }

  toggleNotice(){
    this.noticeOpen = !this.noticeOpen;
  }


  /* ================= FACE MODELS ================= */

  async loadModels() {
    const MODEL_URL = '/assets/models';

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      this.modelsLoaded = true;
      console.log('✅ FaceAPI models loaded (Security)');
    } catch {
      Swal.fire('Error', 'Failed to load face models', 'error');
    }
  }

  /* ================= CAMERA ================= */

  async startCamera() {
    if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
      Swal.fire('Validation', 'Fill all details before starting the camera', 'warning');
      return;
    }

    if (!this.modelsLoaded) {
      Swal.fire('Wait', 'Face models still loading', 'info');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
      this.video.nativeElement.style.transform = 'scaleX(-1)';
      await this.video.nativeElement.play();
    } catch {
      Swal.fire('Camera Error', 'Unable to access camera', 'error');
    }
  }

  /* ================= CAPTURE + DESCRIPTOR ================= */

  async captureImage() {
    if (!this.modelsLoaded) {
      Swal.fire('Wait', 'Face models not loaded yet', 'info');
      return;
    }

    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    this.imagePreview = canvas.toDataURL('image/png');

    canvas.toBlob(async blob => {
      if (!blob) {
        Swal.fire('Error', 'Failed to capture image', 'error');
        return;
      }

      this.imageBlob = blob;

      const img = await faceapi.bufferToImage(blob);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        Swal.fire('Error', 'Face not detected clearly', 'error');
        return;
      }

      this.faceDescriptor = Array.from(detection.descriptor);
      console.log('✅ Security descriptor length:', this.faceDescriptor.length);
    }, 'image/png');

    this.stream?.getTracks().forEach(track => track.stop());

    Swal.fire({ icon: 'success', title: 'Face Captured', timer: 1200, showConfirmButton: false });
  }

  /* ================= SUBMIT ================= */

  addSecurity() {
    if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
      Swal.fire('Validation Error', 'Fill all details', 'warning');
      return;
    }

    if (!this.imageBlob || this.faceDescriptor.length !== 128) {
      Swal.fire('Error', 'Capture face properly before submit', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(this.security).forEach(([key, value]) =>
      formData.append(key, value)
    );

    formData.append('photo', this.imageBlob, 'face.png');
    formData.append('faceDescriptor', JSON.stringify(this.faceDescriptor));

    Swal.fire({ title: 'Adding Security...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Security Added', timer: 1500, showConfirmButton: false })
          .then(() => this.router.navigate(['/list-securities']));
      },
      error: () => Swal.fire('Error', 'Failed to add security', 'error')
    });
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      icon: 'question',
      showCancelButton: true
    }).then(res => {
      if (res.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/admin-login']);
      }
    });
  }
}
