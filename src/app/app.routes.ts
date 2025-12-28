import { Routes } from '@angular/router';

// ---- Public ----
import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';

// ---- Admin Auth ----
import { AdminRegisterComponent } from './auth/admin-register/admin-register.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';

// ---- Admin Pages ----
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAboutComponent } from './admin/admin-about/admin-about.component';

// ---- Resident ----
import { ResidentLoginComponent } from './auth/resident-login/resident-login.component';
import { ResidentHomeComponent } from './resident/resident-home/resident-home.component';
import { ResidentAboutComponent } from './resident/resident-about/resident-about.component';

// ---- Visitor ----
import { VisitorLoginComponent } from './auth/visitor-login/visitor-login.component';
import { VisitorHomeComponent } from './visitor/visitor-home/visitor-home.component';
import { VisitorAboutComponent } from './visitor/visitor-about/visitor-about.component';

// ---- Security ----
import { SecurityLoginComponent } from './auth/security-login/security-login.component';
import { SecurityHomeComponent } from './security/security-home/security-home.component';
import { SecurityAboutComponent } from './security/security-about/security-about.component';

// ---- Admin CRUD (static) ----
import { AddResidentComponent } from './admin/resident/add-resident/add-resident.component';
import { ListResidentsComponent } from './admin/resident/list-residents/list-residents.component';

import { AddVisitorComponent } from './admin/visitor/add-visitor/add-visitor.component';
import { EditVisitorComponent } from './admin/visitor/edit-visitor/edit-visitor.component';
import { ListVisitorsComponent } from './admin/visitor/list-visitors/list-visitors.component';

import { AddSecurityComponent } from './admin/security/add-security/add-security.component';
import { ListSecuritiesComponent } from './admin/security/list-securities/list-securities.component';

export const routes: Routes = [

  // ---- Default ----
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ---- Public ----
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  // ---- Admin Auth ----
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },

  // ---- Admin Pages ----
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'admin-about', component: AdminAboutComponent },

  // ---- Resident CRUD ----
  { path: 'add-resident', component: AddResidentComponent },

  {
    path: 'edit-resident/:id',
    loadComponent: () =>
      import('./admin/resident/edit-resident/edit-resident.component')
        .then(m => m.EditResidentComponent),
    data: { renderMode: 'client' }   // ✅ FIX for Angular 19 prerender
  },

  { path: 'list-residents', component: ListResidentsComponent },

  // ---- Visitor CRUD ----
  { path: 'add-visitor', component: AddVisitorComponent },
  { path: 'edit-visitor', component: EditVisitorComponent },
  { path: 'list-visitors', component: ListVisitorsComponent },

  // ---- Security CRUD ----
  { path: 'add-security', component: AddSecurityComponent },

  {
    path: 'edit-security/:id',
    loadComponent: () =>
      import('./admin/security/edit-security/edit-security.component')
        .then(m => m.EditSecurityComponent),
    data: { renderMode: 'client' }   // ✅ FIX
  },

  { path: 'list-securities', component: ListSecuritiesComponent },

  // ---- Resident ----
  { path: 'resident-login', component: ResidentLoginComponent },
  { path: 'resident-home', component: ResidentHomeComponent },
  { path: 'resident-about', component: ResidentAboutComponent },

  // ---- Visitor ----
  { path: 'visitor-login', component: VisitorLoginComponent },
  { path: 'visitor-home', component: VisitorHomeComponent },
  { path: 'visitor-about', component: VisitorAboutComponent },

  // ---- Security ----
  { path: 'security-login', component: SecurityLoginComponent },
  { path: 'security-home', component: SecurityHomeComponent },
  { path: 'security-about', component: SecurityAboutComponent },

  // ---- Fallback ----
  { path: '**', redirectTo: 'home' }
];
