import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-add-resident',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './add-resident.component.html',
  styleUrls: ['./add-resident.component.css']
})
export class AddResidentComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  blocks = ['A','B','C','D','E','F','G','H','I','J'];
  flats: string[] = [];

  resident = {
    name: '',
    email: '',
    mobile: '',
    flats: [{ block: '', flat: '', type: '' }]
  };

  imageBlob: Blob | null = null;
  imagePreview: string | null = null;
  faceDescriptor: number[] | null = null;
  stream: MediaStream | null = null;

  API_URL = 'http://localhost:5000/api/residents';
  modelsLoaded = false;

  constructor(private http: HttpClient, private router: Router) {
    this.generateFlats();
  }

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



  /* ================= LOAD FACE MODELS ================= */
  async loadModels() {
    try {
      const MODEL_URL = '/assets/models';

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      this.modelsLoaded = true;
      console.log('✅ Face models loaded');
    } catch {
      Swal.fire('Error', 'Failed to load face models', 'error');
    }
  }

  generateFlats() {
    this.flats = [];
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 6; n++) {
        this.flats.push(`${f}0${n}`);
      }
    }
  }

  addFlat() {
    this.resident.flats.push({ block: '', flat: '', type: '' });
  }

  removeFlat(index: number) {
    this.resident.flats.splice(index, 1);
  }

  /* ================= CAMERA ================= */
  async startCamera() {
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Warning', 'Fill Name, Email & Mobile first', 'warning');
      return;
    }

    if (!this.modelsLoaded) {
      Swal.fire('Wait', 'Face models not loaded yet', 'info');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement;
      videoEl.srcObject = this.stream;
      videoEl.style.transform = 'scaleX(-1)';
      await videoEl.play();
    } catch {
      Swal.fire('Error', 'Camera access denied', 'error');
    }
  }

  /* ================= CAPTURE + DESCRIPTOR ================= */
  async captureImage() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    if (!video.videoWidth) {
      Swal.fire('Error', 'Camera not ready', 'error');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    this.imagePreview = canvas.toDataURL('image/png');

    canvas.toBlob(blob => {
      this.imageBlob = blob;
    }, 'image/png');

    const detection = await faceapi
      .detectSingleFace(canvas)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection || detection.descriptor.length !== 128) {
      Swal.fire('Error', 'Face not detected properly. Try again.', 'error');
      return;
    }

    // ✅ SET DESCRIPTOR FIRST
    this.faceDescriptor = Array.from(detection.descriptor);
    console.log('✅ Descriptor saved, length:', this.faceDescriptor.length);

    // ✅ STOP CAMERA AFTER SUCCESS
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;

    Swal.fire({
      icon: 'success',
      title: 'Face Captured',
      timer: 1200,
      showConfirmButton: false
    });
  }

  /* ================= SUBMIT ================= */
  addResident() {
    if (!this.imageBlob || !this.faceDescriptor || this.faceDescriptor.length !== 128) {
      Swal.fire('Error', 'Capture face properly before submit', 'error');
      return;
    }

    if (this.resident.flats.some(f => !f.block || !f.flat || !f.type)) {
      Swal.fire('Validation Error', 'Select block, flat & type', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.resident.name);
    formData.append('email', this.resident.email);
    formData.append('mobile', this.resident.mobile);
    formData.append('flats', JSON.stringify(this.resident.flats));
    formData.append('photo', this.imageBlob, 'face.png');
    formData.append('faceDescriptor', JSON.stringify(this.faceDescriptor));

    Swal.fire({
      title: 'Adding Resident...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.http.post(this.API_URL, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Resident Added',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.router.navigate(['/list-residents']));
      },
      error: err => {
        Swal.fire('Error', err.error?.message || 'Failed', 'error');
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/admin-login']);
  }
}
