import { Routes } from '@angular/router';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ResidentHomeComponent } from './resident/resident-home/resident-home.component';
import { ResidentLoginComponent } from './auth/resident-login/resident-login.component';
import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';
import { AdminRegisterComponent } from './auth/admin-register/admin-register.component';
import { VisitorLoginComponent } from './auth/visitor-login/visitor-login.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { VisitorHomeComponent } from './visitor/visitor-home/visitor-home.component';
import { VisitorAboutComponent } from './visitor/visitor-about/visitor-about.component';
import { ResidentAboutComponent } from './resident/resident-about/resident-about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent, },
  { path: 'admin-home', component: AdminHomeComponent },

  { path: 'resident-login', component: ResidentLoginComponent },
  { path: 'resident-home', component: ResidentHomeComponent },
  { path: 'resident-about', component: ResidentAboutComponent },

  { path: 'visitor-login', component: VisitorLoginComponent },
  { path: 'visitor-home', component: VisitorHomeComponent },
  { path: 'visitor-about', component: VisitorAboutComponent },

  { path: '**', redirectTo: 'home' }
];
