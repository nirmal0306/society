import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-visitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.css']
})
export class AddVisitorComponent implements OnInit {

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  blocks = ['A','B','C','D','E','F','G','H'];
  flats: string[] = [];

  visitor = {
    name: '',
    email: '',
    mobile: '',
    visitorType: '',
    block: '',
    flat: '',
    purpose: ''
  };

  securityName = '';
  securityEmail = '';
  stream: any;
  imageBlob: any;
  imagePreview: any;

  API_URL = "http://localhost:5000/api/visitors";

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.generateFlats();
    this.loadSecurityData();
  }

  /* ================= GENERATE FLATS ================= */
  generateFlats() {
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 6; n++) {
        this.flats.push(`${f}0${n}`);
      }
    }
  }

  /* ================= LOAD SECURITY INFO ================= */
/* ================= LOAD SECURITY PROFILE ================= */
loadSecurityData() {
  const email = localStorage.getItem("email");

  if (!email) {
    this.router.navigate(['/security-login']); // redirect if not logged in
    return;
  }

  this.http.get<any>(`http://localhost:5000/api/security/profile/${email}`)
    .subscribe({
      next: (res) => {
        this.securityName = res.name;
        this.securityEmail = res.email;
      },
      error: () => {
        Swal.fire("Error", "Failed to load security profile", "error");
      }
    });
}

  /* ================= CAMERA ================= */
  async startCamera() {
    if (!this.visitor.name || !this.visitor.email || !this.visitor.mobile) {
      Swal.fire("Warning","Fill Name, Email & Mobile first","warning");
      return;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoEl = this.video.nativeElement;
      videoEl.srcObject = this.stream;
      videoEl.style.transform = "scaleX(-1)";
      await videoEl.play();
    } catch {
      Swal.fire("Error","Camera access denied","error");
    }
  }

  /* ================= CAPTURE IMAGE ================= */
  captureImage() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    if (!video.videoWidth) { Swal.fire("Error","Camera not ready","error"); return; }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(-1,1);
    ctx.drawImage(video,-canvas.width,0,canvas.width,canvas.height);
    ctx.restore();

    this.imagePreview = canvas.toDataURL("image/png");
    canvas.toBlob(blob => { this.imageBlob = blob; }, "image/png");

    this.stream?.getTracks().forEach((t:any)=>t.stop());
    this.stream = null;

    Swal.fire({ icon:"success", title:"Photo Captured", timer:1200, showConfirmButton:false });
  }

  /* ================= ADD VISITOR ================= */
  addVisitor() {
    if (!this.imageBlob) {
      Swal.fire("Error","Capture visitor photo","error");
      return;
    }

    const formData = new FormData();
    formData.append("name", this.visitor.name);
    formData.append("email", this.visitor.email);
    formData.append("mobile", this.visitor.mobile);
    formData.append("visitorType", this.visitor.visitorType);
    formData.append("block", this.visitor.block.trim().toUpperCase());
    formData.append("flat", this.visitor.flat.trim());
    formData.append("purpose", this.visitor.purpose);
    formData.append("photo", this.imageBlob, "visitor.png");

    // ================= ADD SECURITY DATA =================
    formData.append("securityName", this.securityName);
    formData.append("securityEmail", this.securityEmail);
    // console.log(this.securityName)
    // alert(this.securityName)

    Swal.fire({ title:"Sending request...", didOpen:()=>Swal.showLoading(), allowOutsideClick:false });

    this.http.post(this.API_URL, formData).subscribe({
      next: (res:any) => {
        Swal.fire("Success", res.message || "Request sent to resident", "success");
        this.router.navigate(['/list-visitors-security']);
      },
      error: err => {
        Swal.fire("Error", err.error?.message || "Failed", "error");
      }
    });
  }

  /* ================= NAVBAR ================= */
  menuOpen = false;
  servicesOpen = false;
  visitorsOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleServices() { this.servicesOpen = !this.servicesOpen; }
  toggleVisitors() { this.visitorsOpen = !this.visitorsOpen; }

  /* ================= LOGOUT ================= */
  logout() {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout"
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({ icon:"success", title:"Logged Out", timer:1200, showConfirmButton:false })
          .then(() => this.router.navigate(['/login']));
      }
    });
  }

}
