// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-edit-event',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
//   templateUrl: './edit-event.component.html',
//   styleUrls: ['./edit-event.component.css']
// })
// export class EditEventComponent implements OnInit {

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private http: HttpClient
//   ) {}

//   event: any = {
//     _id: '',
//     title: '',
//     description: '',
//     date: '',
//     time: '',
//     venue: {
//       address: '',
//       mapUrl: ''
//     }
//   };

//   venueMode: 'manual' | 'map' = 'manual';

//   /* ================= LOAD EVENT ================= */

//   ngOnInit() {

//     const id = this.route.snapshot.paramMap.get('id');

//     this.http.get(`http://localhost:5000/api/events/${id}`)
//       .subscribe({
//         next: (data: any) => {

//           this.event = data;

//           if (this.event.venue.mapUrl) {
//             this.venueMode = 'map';
//           }

//         },
//         error: () => {

//           Swal.fire('Error', 'Event not found', 'error')
//             .then(() => this.router.navigate(['/list-events']));

//         }
//       });
//   }

//   /* ================= MENU ================= */

//   menuOpen = false;
//   servicesOpen = false;
//   residentsOpen = false;
//   securityOpen = false;
//   visitorsOpen = false;
//   eventOpen = false;
//   noticeOpen = false;

//   toggleMenu() { this.menuOpen = !this.menuOpen; }
//   toggleServices() { this.servicesOpen = !this.servicesOpen; }
//   toggleResidents() { this.residentsOpen = !this.residentsOpen; }
//   toggleSecurity() { this.securityOpen = !this.securityOpen; }
//   toggleVisitors() { this.visitorsOpen = !this.visitorsOpen; }
//   toggleEvent() { this.eventOpen = !this.eventOpen; }
//   toggleNotice() { this.noticeOpen = !this.noticeOpen; }

//   /* ================= MAP ================= */

//   openMap() {
//     window.open('https://www.google.com/maps', '_blank');
//   }

//   extractAddress() {

//     if (!this.event.venue.mapUrl) return;

//     try {

//       const decodedUrl = decodeURIComponent(this.event.venue.mapUrl);
//       const match = decodedUrl.match(/\/place\/([^/]+)/);

//       this.event.venue.address = match
//         ? match[1].replace(/\+/g, ' ')
//         : 'Map Location';

//     } catch {

//       this.event.venue.address = 'Map Location';

//     }

//   }

//   switchVenueMode(mode: 'manual' | 'map') {

//     this.venueMode = mode;

//     this.event.venue.address = '';
//     this.event.venue.mapUrl = '';

//   }

//   /* ================= UPDATE EVENT ================= */

//   updateEvent() {

//     const { title, description, date, time, venue } = this.event;

//     if (!title || !description || !date || !time || !venue.address) {

//       Swal.fire('Validation Error', 'Please fill all fields', 'warning');
//       return;

//     }

//     this.http.put(
//       `http://localhost:5000/api/events/${this.event._id}`,
//       this.event
//     ).subscribe({

//       next: () => {

//         Swal.fire({
//           icon: 'success',
//           title: 'Event Updated',
//           timer: 1500,
//           showConfirmButton: false
//         }).then(() => {

//           this.router.navigate(['/list-events']);

//         });

//       },

//       error: () => {

//         Swal.fire('Error', 'Failed to update event', 'error');

//       }

//     });

//   }

//   /* ================= LOGOUT ================= */

//   logout() {

//     Swal.fire({
//       title: 'Logout?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes Logout'
//     }).then(result => {

//       if (result.isConfirmed) {

//         localStorage.clear();

//         Swal.fire({
//           icon: 'success',
//           title: 'Logged Out',
//           timer: 1200,
//           showConfirmButton: false
//         }).then(() => {

//           this.router.navigate(['/admin-login']);

//         });

//       }

//     });

//   }

// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  API_URL = 'http://localhost:5000/api/events';

  event: any = {
    _id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    venue: {
      address: '',
      mapUrl: ''
    }
  };

  venueMode: 'manual' | 'map' = 'manual';

  /* ================= LOAD EVENT ================= */

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      Swal.fire('Error','Invalid event ID','error');
      this.router.navigate(['/list-events']);
      return;
    }

    this.http.get<any>(`${this.API_URL}/${id}`)
      .subscribe({

        next: (res) => {

          this.event = res.data;   // 🔥 IMPORTANT FIX

          if (this.event.venue?.mapUrl) {
            this.venueMode = 'map';
          }

        },

        error: () => {
          Swal.fire('Error','Event not found','error')
          .then(() => this.router.navigate(['/list-events']));
        }

      });

  }

  /* ================= MENU STATES ================= */

  menuOpen = false;
  servicesOpen = false;
  residentsOpen = false;
  securityOpen = false;
  visitorsOpen = false;
  eventOpen = false;
  noticeOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleServices() { this.servicesOpen = !this.servicesOpen; }
  toggleResidents() { this.residentsOpen = !this.residentsOpen; }
  toggleSecurity() { this.securityOpen = !this.securityOpen; }
  toggleVisitors() { this.visitorsOpen = !this.visitorsOpen; }
  toggleEvent() { this.eventOpen = !this.eventOpen; }
  toggleNotice() { this.noticeOpen = !this.noticeOpen; }

  /* ================= MAP FUNCTIONS ================= */

  openMap() {
    window.open('https://www.google.com/maps', '_blank');
  }

  extractAddress() {

    if (!this.event.venue.mapUrl) return;

    try {

      const decodedUrl = decodeURIComponent(this.event.venue.mapUrl);
      const match = decodedUrl.match(/\/place\/([^/]+)/);

      this.event.venue.address = match
        ? match[1].replace(/\+/g, ' ')
        : 'Map Location';

    } catch {

      this.event.venue.address = 'Map Location';

    }

  }

  switchVenueMode(mode: 'manual' | 'map') {

    this.venueMode = mode;

    this.event.venue.address = '';
    this.event.venue.mapUrl = '';

  }

  /* ================= UPDATE EVENT ================= */

  updateEvent() {

    const { title, description, date, time, venue } = this.event;

    if (!title || !description || !date || !time || !venue.address) {

      Swal.fire('Validation Error','Please fill all fields','warning');
      return;

    }

    this.http.put(`${this.API_URL}/${this.event._id}`, this.event)
      .subscribe({

        next: () => {

          Swal.fire({
            icon:'success',
            title:'Event Updated',
            timer:1500,
            showConfirmButton:false
          }).then(() => {

            this.router.navigate(['/list-events']);

          });

        },

        error: () => {

          Swal.fire('Error','Failed to update event','error');

        }

      });

  }

  /* ================= LOGOUT ================= */

  logout() {

    Swal.fire({
      title:'Logout?',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText:'Yes, Logout'
    }).then(result => {

      if (result.isConfirmed) {

        localStorage.clear();

        Swal.fire({
          icon:'success',
          title:'Logged Out',
          timer:1200,
          showConfirmButton:false
        }).then(() => {

          this.router.navigate(['/admin-login']);

        });

      }

    });

  }

}
