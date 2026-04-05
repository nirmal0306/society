import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

import * as faceapi from 'face-api.js';
import Swal from 'sweetalert2';
import { NavComponent } from '../../nav/nav/nav.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule,NavComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLCanvasElement>;

  loginForm!: FormGroup;
  stream: MediaStream | null = null;
  loading = false;
  modelsLoaded = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  /* =============================
     INIT
     ============================= */
  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    await this.loadModels();
  }

  /* =============================
     DESTROY
     ============================= */
  ngOnDestroy() {
    this.stopCamera();
  }

  /* =============================
     LOAD FACE-API MODELS
     ============================= */
  async loadModels() {
    try {
      const MODEL_URL = '/assets/models';

      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);

      this.modelsLoaded = true;
      console.log('✅ Face-api models loaded');
    } catch (err) {
      Swal.fire('Error', 'Failed to load face models', 'error');
    }
  }

  /* =============================
     START CAMERA
     ============================= */
  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement;

      videoEl.srcObject = this.stream;

      await new Promise<void>((resolve) => {
        videoEl.onloadedmetadata = () => {
          videoEl.play();
          resolve();
        };
      });

      console.log('🎥 Camera started:', videoEl.videoWidth, videoEl.videoHeight);
    } catch {
      Swal.fire('Permission Denied', 'Camera access is required', 'error');
    }
  }

  /* =============================
     STOP CAMERA
     ============================= */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /* =============================
     FACE LOGIN
     ============================= */
  async faceLogin() {
  if (this.loginForm.invalid) {
    Swal.fire('Invalid', 'Email is required', 'warning');
    return;
  }

  const videoEl = this.video.nativeElement;

  if (!videoEl.videoWidth || !videoEl.videoHeight) {
    Swal.fire('Wait', 'Camera is not ready', 'info');
    return;
  }

  this.loading = true;

  try {
    const detection = await faceapi
      .detectSingleFace(videoEl)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      Swal.fire('No Face', 'Face not detected. Try again.', 'error');
      this.loading = false;
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    this.http.post<any>('http://localhost:5000/api/auth/login', {
      email: this.loginForm.value.email,
      descriptor
    }).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: `Welcome ${res.name}`,
          timer: 2000,
          showConfirmButton: false
        });

        localStorage.setItem('role', res.role);
        localStorage.setItem('email', res.email);
        localStorage.setItem('name', res.name);
        console.log(res.email);

        setTimeout(() => {
          if (res.role === 'resident') {
            this.router.navigate(['/resident-home']);
          } else {
            this.router.navigate(['/security-home']);
          }
        }, 2000);

        // ✅ Fixed TS2531
        this.stream?.getTracks().forEach(track => track.stop());

        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Failed', err.error?.message || 'Face does not match this email', 'error');
        this.loading = false;
      }
    });
  } catch (err) {
    Swal.fire('Error', 'Face recognition failed', 'error');
    this.loading = false;
  }
}

}
