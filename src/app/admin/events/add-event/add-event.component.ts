
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule,AdminNavComponent],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})

export class AddEventComponent {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
  }

  /* ================= EVENT MODEL ================= */
  event = {
    title: '',
    description: '',
    date: '',
    time: '',
    venue: {
      address: '',
      mapUrl: ''
    }
  };

  // 👇 NEW: venue mode
  venueMode: 'manual' | 'map' = 'manual';



  /* ================= MAP ================= */
  openMap() {
    window.open('https://www.google.com/maps', '_blank');
  }


  extractAddress() {
    if (!this.event.venue.mapUrl) return;

    try {
      const decodedUrl = decodeURIComponent(this.event.venue.mapUrl);

      // Extract place name after /place/
      const match = decodedUrl.match(/\/place\/([^/]+)/);

      if (match && match[1]) {
        this.event.venue.address = match[1].replace(/\+/g, ' ');
      } else {
        this.event.venue.address = 'Map Location';
      }

    } catch (error) {
      this.event.venue.address = 'Map Location';
    }
  }


  // 👇 reset when switching mode
  switchVenueMode(mode: 'manual' | 'map') {
    this.venueMode = mode;
    this.event.venue.address = '';
    this.event.venue.mapUrl = '';
  }

  addEvent() {
  const { title, description, date, time, venue } = this.event;

  if (!title || !description || !date || !time || !venue.address) {
    Swal.fire('Validation Error', 'Please fill all fields', 'warning');
    return;
  }

  const events = JSON.parse(localStorage.getItem('events') || '[]');
  events.push(this.event);
  localStorage.setItem('events', JSON.stringify(events));

  this.http.post('http://localhost:5000/api/events', this.event)
    .subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/list-events']);
        });
      },
      error: () => {
        Swal.fire('Error', 'Failed to create event', 'error');
      }
    });
}

}
