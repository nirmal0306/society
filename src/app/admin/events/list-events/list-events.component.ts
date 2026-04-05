import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdminNavComponent } from '../../../nav/admin-nav/admin-nav.component';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: {
    address: string;
    mapUrl: string;
  };
}

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule,AdminNavComponent],
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.css']
})
export class ListEventsComponent implements OnInit {

  events: Event[] = [];
  filteredEvents: Event[] = [];
  paginatedEvents: Event[] = [];
  loading = false;

  /* SEARCH */
  searchText = '';

  /* SORT */
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortFieldClicked = false; // Tracks if user clicked to sort

  /* PAGINATION */
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  /* BACKEND URL */
  private API_URL = 'http://localhost:5000/api/events';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');

    if (!email) {
      this.router.navigate(['/admin-login']);
      return;
    }
    this.getEvents();
  }

  /* ================= API ================= */
  getEvents() {
    this.loading = true;
    this.http.get<any>(this.API_URL).subscribe({
      next: (res) => {
        // Support multiple backend formats
        this.events = res.data || res.events || res || [];
        this.loading = false;
        this.applyFilter(); // Display in backend order by default
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load events', 'error');
      }
    });
  }

  /* ================= EDIT / DELETE ================= */
  editEvent(id: string) {
    this.router.navigate(['/edit-event', id]);
  }

  deleteEvent(id: string) {
    Swal.fire({
      title: 'Delete Event?',
      text: 'This event will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_URL}/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Event deleted successfully', 'success');
            this.events = this.events.filter(e => e._id !== id);
            this.applyFilter();
          },
          error: () => Swal.fire('Error', 'Failed to delete event', 'error')
        });
      }
    });
  }

  /* ================= SEARCH ================= */
  applyFilter() {
    const value = this.searchText.toLowerCase();
    this.filteredEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(value) ||
      event.date.includes(value) ||
      event.venue?.address?.toLowerCase().includes(value)
    );

    this.currentPage = 1;

    if (this.sortFieldClicked) {
      this.applySorting();
    } else {
      this.updatePagination();
    }
  }

  /* ================= SORT ================= */
  sortData(column: string) {
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
      this.sortDirection = 'asc';
    }

    this.sortFieldClicked = true;
    this.applySorting();
  }

  applySorting() {
    this.filteredEvents.sort((a: any, b: any) => {
      let fieldA: any = a[this.sortField] || '';
      let fieldB: any = b[this.sortField] || '';

      // Compare strings for title, date, time
      if (this.sortField === 'date' || this.sortField === 'time') {
        fieldA = fieldA.toString();
        fieldB = fieldB.toString();
      } else {
        fieldA = fieldA.toString().toLowerCase();
        fieldB = fieldB.toString().toLowerCase();
      }

      if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  getSortIcon(column: string) {
    if (!this.sortFieldClicked || this.sortField !== column) return '⇅';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  /* ================= PAGINATION ================= */
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEvents.length / this.itemsPerPage) || 1;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
