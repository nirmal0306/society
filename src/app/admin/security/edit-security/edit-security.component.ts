// import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-edit-security',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
//   templateUrl: './edit-security.component.html',
//   styleUrls: ['./edit-security.component.css']
// })
// export class EditSecurityComponent implements OnInit {

//   @ViewChild('video') video!: ElementRef;
//   @ViewChild('canvas') canvas!: ElementRef;

//   security = {
//     _id: '',
//     name: '',
//     email: '',
//     mobile: '',
//     shift: '',
//     photo: ''
//   };

//   shifts = ['Morning', 'Afternoon', 'Night'];
//   imageBlob!: Blob;
//   imagePreview: string | null = null;
//   stream!: MediaStream;

//   private API_URL = 'http://localhost:5000/api/security';

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) this.loadSecurity(id);
//   }

//   loadSecurity(id: string) {
//     this.http.get<any>(`${this.API_URL}/${id}`).subscribe({
//       next: res => {
//         this.security = res;
//         this.imagePreview = res.photo ? `http://localhost:5000${res.photo}` : null;
//       },
//       error: () => Swal.fire('Error', 'Failed to load security staff', 'error')
//     });
//   }

//   // ================= CAMERA METHODS =================
//   async startCamera() {
//     if (!this.security.name || !this.security.email || !this.security.mobile) {
//       Swal.fire('Warning', 'Fill Name, Email & Mobile first', 'warning');
//       return;
//     }

//     try {
//       this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       const videoEl = this.video.nativeElement as HTMLVideoElement;
//       videoEl.srcObject = this.stream;
//       videoEl.style.transform = 'scaleX(-1)';
//       videoEl.play();
//     } catch {
//       Swal.fire('Error', 'Camera access denied', 'error');
//     }
//   }

//   captureImage() {
//     if (!this.stream) {
//       Swal.fire('Error', 'Camera not started', 'error');
//       return;
//     }

//     const video = this.video.nativeElement as HTMLVideoElement;
//     const canvas = this.canvas.nativeElement as HTMLCanvasElement;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.save();
//     ctx.scale(-1, 1); // mirror image
//     ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
//     ctx.restore();

//     // Save preview
//     this.imagePreview = canvas.toDataURL('image/png');

//     // Convert to Blob for upload
//     canvas.toBlob(blob => {
//       if (blob) this.imageBlob = blob;
//     }, 'image/png');

//     // Stop camera
//     this.stream.getTracks().forEach(track => track.stop());
//     Swal.fire({ icon: 'success', title: 'Captured', timer: 1200, showConfirmButton: false });
//   }

//   // ================= UPDATE SECURITY =================
//   updateSecurity() {
//     if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
//       Swal.fire('Validation Error', 'Please fill all details', 'warning');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', this.security.name);
//     formData.append('email', this.security.email);
//     formData.append('mobile', this.security.mobile);
//     formData.append('shift', this.security.shift);
//     if (this.imageBlob) formData.append('photo', this.imageBlob, 'photo.png');

//     Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

//     this.http.put(`${this.API_URL}/${this.security._id}`, formData).subscribe({
//       next: () => Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false })
//                   .then(() => this.router.navigate(['/list-securities'])),
//       error: () => Swal.fire('Error', 'Failed to update security staff', 'error')
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
//              .then(() => this.router.navigate(['/admin-login']));
//       }
//     });
//   }
// }

import {
  Component,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-edit-security',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-security.component.html',
  styleUrls: ['./edit-security.component.css']
})
export class EditSecurityComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  security = {
    _id: '',
    name: '',
    email: '',
    mobile: '',
    shift: '',
    photo: ''
  };

  shifts = ['Morning', 'Afternoon', 'Night'];

  imageBlob!: Blob;
  imagePreview: string | null = null;
  faceDescriptor: number[] = [];
  stream!: MediaStream;

  private API_URL = 'http://localhost:5000/api/security';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /* ================= INIT ================= */
  async ngOnInit() {
    await this.loadFaceModels();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadSecurity(id);
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


  async loadFaceModels() {
    const MODEL_URL = '/assets/models';
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ]);
  }

  loadSecurity(id: string) {
    this.http.get<any>(`${this.API_URL}/${id}`).subscribe({
      next: res => {
        this.security = res;
        this.imagePreview = res.photo
          ? `http://localhost:5000${res.photo}`
          : null;
      },
      error: () => Swal.fire('Error', 'Failed to load security staff', 'error')
    });
  }

  /* ================= CAMERA ================= */
  async startCamera() {
    if (!this.security.name || !this.security.email || !this.security.mobile) {
      Swal.fire('Warning', 'Fill Name, Email & Mobile first', 'warning');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
      this.video.nativeElement.style.transform = 'scaleX(-1)';
      await this.video.nativeElement.play();
    } catch {
      Swal.fire('Error', 'Camera access denied', 'error');
    }
  }

  /* ================= CAPTURE + DESCRIPTOR ================= */
  async captureImage() {
    if (!this.stream) {
      Swal.fire('Error', 'Camera not started', 'error');
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
      if (!blob) return;

      this.imageBlob = blob;

      /* ===== FACE DETECTION ===== */
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

      Swal.fire({
        icon: 'success',
        title: 'Face Captured',
        timer: 1200,
        showConfirmButton: false
      });
    }, 'image/png');

    this.stream.getTracks().forEach(t => t.stop());
  }

  /* ================= UPDATE ================= */
  updateSecurity() {
    if (!this.security.name || !this.security.email || !this.security.mobile || !this.security.shift) {
      Swal.fire('Validation Error', 'Please fill all details', 'warning');
      return;
    }

    if (!this.faceDescriptor.length && !this.imagePreview) {
      Swal.fire('Error', 'Capture face before updating', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.security.name);
    formData.append('email', this.security.email);
    formData.append('mobile', this.security.mobile);
    formData.append('shift', this.security.shift);

    if (this.imageBlob) {
      formData.append('photo', this.imageBlob, 'face.png');
      formData.append('descriptor', JSON.stringify(this.faceDescriptor));
    }

    Swal.fire({ title: 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this.http.put(`${this.API_URL}/${this.security._id}`, formData).subscribe({
      next: () =>
        Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false })
          .then(() => this.router.navigate(['/list-securities'])),
      error: () => Swal.fire('Error', 'Failed to update security staff', 'error')
    });
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      icon: 'question',
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/admin-login']);
      }
    });
  }
}
