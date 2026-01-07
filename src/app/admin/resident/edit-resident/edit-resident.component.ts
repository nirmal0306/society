import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-resident',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-resident.component.html',
  styleUrls: ['./edit-resident.component.css']
})
export class EditResidentComponent implements OnInit {

  @ViewChild('video') video!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  blocks = ['A','B','C','D','E','F','G','H','I','J'];
  flats: string[] = [];

  resident = {
    _id: '',
    name: '',
    email: '',
    mobile: '',
    flats: [{ block: '', flat: '' }],
    photo: ''
  };

  imageBlob!: Blob;
  imagePreview: string | null = null;
  stream!: MediaStream;

  API_URL = 'http://localhost:5000/api/residents';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.generateFlats();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadResident(id);
  }

  generateFlats() {
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 6; n++) {
        this.flats.push(`${f}0${n}`);
      }
    }
  }

  loadResident(id: string) {
    this.http.get<any>(`${this.API_URL}/${id}`).subscribe({
      next: (res) => {
        this.resident = res;
        this.imagePreview = res.photo ? `http://localhost:5000${res.photo}` : null;
      },
      error: () => Swal.fire('Error', 'Failed to load resident', 'error')
    });
  }

  addFlat() {
    this.resident.flats.push({ block: '', flat: '' });
  }

  removeFlat(i: number) {
    this.resident.flats.splice(i, 1);
  }

  async startCamera() {
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Warning', 'Fill Name, Email & Mobile first', 'warning');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement as HTMLVideoElement;
      videoEl.srcObject = this.stream;
      videoEl.style.transform = 'scaleX(-1)'; // mirror
      videoEl.play();
    } catch {
      Swal.fire('Error', 'Camera access denied', 'error');
    }
  }

  captureImage() {
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Warning', 'Fill Name, Email & Mobile first', 'warning');
      return;
    }

    const video = this.video.nativeElement as HTMLVideoElement;
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    this.imagePreview = canvas.toDataURL('image/png');

    canvas.toBlob((blob: Blob | null) => {
      if (blob) this.imageBlob = blob;
    }, 'image/png');

    // Stop camera after capture
    if (this.stream) this.stream.getTracks().forEach(track => track.stop());

    Swal.fire({ icon: 'success', title: 'Captured', timer: 1200, showConfirmButton: false });
  }

  updateResident() {
    if (!this.resident.name || !this.resident.email || !this.resident.mobile) {
      Swal.fire('Validation Error', 'Please fill all details', 'warning');
      return;
    }

    if (this.resident.flats.some(f => !f.block || !f.flat)) {
      Swal.fire('Validation Error', 'Select block and flat properly', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.resident.name);
    formData.append('email', this.resident.email);
    formData.append('mobile', this.resident.mobile);
    formData.append('flats', JSON.stringify(this.resident.flats));

    // Only append new image if captured
    if (this.imageBlob) formData.append('photo', this.imageBlob, 'face.png');

    Swal.fire({ title: 'Updating...', allowOutsideClick:false, didOpen:()=> Swal.showLoading() });

    this.http.put(`${this.API_URL}/${this.resident._id}`, formData).subscribe({
      next: () => Swal.fire({ icon:'success', title:'Updated', timer:1500, showConfirmButton:false })
                   .then(()=> this.router.navigate(['/list-residents'])),
      error: () => Swal.fire('Error','Failed to update resident','error')
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
        Swal.fire({ icon:'success', title:'Logged Out', timer:1200, showConfirmButton:false })
             .then(()=> this.router.navigate(['/admin-login']));
      }
    });
  }
}
