import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // <-- ADD THIS
import { ANavComponent } from '../../nav/a-nav/a-nav.component';

@Component({
  selector: 'app-a-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,ANavComponent], // <-- add RouterModule here
  templateUrl: './a-home.component.html',
  styleUrl: './a-home.component.css'
})
export class AHomeComponent {
 
}
