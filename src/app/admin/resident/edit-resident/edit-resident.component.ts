import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import * as faceapi from 'face-api.js';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

@Component({
  selector: 'app-edit-resident',
  standalone: true,
  imports: [CommonModule, AdminNavComponent, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-resident.component.html',
  styleUrls: ['./edit-resident.component.css']
})
export class EditResidentComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  API_URL = 'http://localhost:5000/api/residents';

  blocks = ['A','B','C','D','E','F','G','H','I','J'];
  flats: string[] = [];

  resident: any = {
    _id: '',
    name: '',
    email: '',
    mobile: '',
    flats: [{ block:'', flat:'', type:'' }],
    photo: ''
  };

  imageBlob?: Blob;
  imagePreview: string | null = null;
  stream?: MediaStream;

  // ✅ REQUIRED
  faceDescriptor: number[] = [];
  modelsLoaded = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.generateFlats();
  }

  /* ================= INIT ================= */

  async ngOnInit() {

    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
    await this.loadModels();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadResident(id);
  }


  async loadModels() {
    const MODEL_URL = '/assets/models';

    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      this.modelsLoaded = true;
      console.log('✅ FaceAPI models loaded');
    } catch (err) {
      Swal.fire('Error', 'Failed to load face models', 'error');
    }
  }

  /* ================= UTILS ================= */

  generateFlats() {
    this.flats = [];
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 6; n++) {
        this.flats.push(`${f}0${n}`);
      }
    }
  }

  loadResident(id: string) {
    this.http.get<any>(`${this.API_URL}/${id}`).subscribe({
      next: res => {
        this.resident = res;
        this.imagePreview = res.photo ? `http://localhost:5000${res.photo}` : null;
      },
      error: () => Swal.fire('Error', 'Failed to load resident', 'error')
    });
  }

  addFlat() {
    this.resident.flats.push({ block:'', flat:'', type:'' });
  }

  removeFlat(index: number) {
    this.resident.flats.splice(index, 1);
  }

  /* ================= CAMERA ================= */

  async startCamera() {
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
      Swal.fire('Error', 'Camera permission denied', 'error');
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
      if (!blob) return;

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
      console.log('✅ Descriptor length:', this.faceDescriptor.length);
    }, 'image/png');

    this.stream?.getTracks().forEach(t => t.stop());

    Swal.fire({
      icon: 'success',
      title: 'Face Captured',
      timer: 1200,
      showConfirmButton: false
    });
  }

  /* ================= UPDATE ================= */

  updateResident() {
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Validation Error', 'Fill all details', 'warning');
      return;
    }

    if (this.imageBlob && this.faceDescriptor.length !== 128) {
      Swal.fire('Error', 'Face data missing', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.resident.name);
    formData.append('email', this.resident.email);
    formData.append('mobile', this.resident.mobile);
    formData.append('flats', JSON.stringify(this.resident.flats));

    if (this.imageBlob) {
      formData.append('photo', this.imageBlob, 'resident.png');
      formData.append('faceDescriptor', JSON.stringify(this.faceDescriptor));
    }

    Swal.fire({ title:'Updating...', allowOutsideClick:false, didOpen:()=>Swal.showLoading() });

    this.http.put(`${this.API_URL}/${this.resident._id}`, formData).subscribe({
      next: () => {
        Swal.fire({ icon:'success', title:'Updated', timer:1500, showConfirmButton:false })
          .then(() => this.router.navigate(['/list-residents']));
      },
      error: () => Swal.fire('Error', 'Update failed', 'error')
    });
  }
}
