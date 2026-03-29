import { Routes } from '@angular/router';

import { HomeComponent } from './user/home/home.component';
import { AboutComponent } from './user/about/about.component';

import { AdminRegisterComponent } from './auth/admin-register/admin-register.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminAboutComponent } from './admin/admin-about/admin-about.component';

import { ResidentHomeComponent } from './resident/resident-home/resident-home.component';
import { ResidentAboutComponent } from './resident/resident-about/resident-about.component';

import { SecurityHomeComponent } from './security/security-home/security-home.component';
import { SecurityAboutComponent } from './security/security-about/security-about.component';

// ---- Admin CRUD ----
import { AddResidentComponent } from './admin/resident/add-resident/add-resident.component';
import { EditResidentComponent } from './admin/resident/edit-resident/edit-resident.component';
import { ListResidentsComponent } from './admin/resident/list-residents/list-residents.component';

import { AddVisitorComponent } from './security/add-visitor/add-visitor.component';
import { ListVisitorsComponent } from './admin/visitor/list-visitors/list-visitors.component';

import { AddSecurityComponent } from './admin/security/add-security/add-security.component';
import { EditSecurityComponent } from './admin/security/edit-security/edit-security.component';
import { ListSecuritiesComponent } from './admin/security/list-securities/list-securities.component';
import { LoginComponent } from './auth/login/login.component';
import { AHomeComponent } from './user/a-home/a-home.component';
import { AAboutComponent } from './user/a-about/a-about.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { ManageComplaintsComponent } from './admin/manage-complaints/manage-complaints.component';
import { ManageParkingComponent } from './admin/manage-parking/manage-parking.component';
import { AddEventComponent } from './admin/events/add-event/add-event.component';
import { EditEventComponent } from './admin/events/edit-event/edit-event.component';
import { ListEventsComponent } from './admin/events/list-events/list-events.component';
import { AddNoticeComponent } from './admin/notice/add-notice/add-notice.component';
import { EditNoticeComponent } from './admin/notice/edit-notice/edit-notice.component';
import { ListNoticesComponent } from './admin/notice/list-notices/list-notices.component';
import { ListMaintenanceComponent } from './admin/maintenance/list-maintenance/list-maintenance.component';
import { PendingMaintenanceComponent } from './admin/maintenance/pending-maintenance/pending-maintenance.component';
import { ResidentProfileComponent } from './resident/resident-profile/resident-profile.component';
import { PayMaintenanceComponent } from './resident/pay-maintenance/pay-maintenance.component';
import { ParkingComponent } from './resident/parking/parking.component';
import { ManageVisitorComponent } from './resident/manage-visitor/manage-visitor.component';
import { ListNoticeResidentComponent } from './resident/list-notice-resident/list-notice-resident.component';
import { ListEventResidentComponent } from './resident/list-event-resident/list-event-resident.component';
import { AddComplaintComponent } from './resident/add-complaint/add-complaint.component';
import { ListComplaintsComponent } from './resident/list-complaints/list-complaints.component';
import { SecurityProfileComponent } from './security/security-profile/security-profile.component';
import { ListVisitorsSecurityComponent } from './security/list-visitors-security/list-visitors-security.component';
import { PaymentModalComponent } from './resident/payment-modal/payment-modal.component';
import { MaintenanceDetailsComponent } from './resident/maintenance-details/maintenance-details.component';

export const routes: Routes = [

  // ---- Default ----
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ---- Public ----
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'a-home', component: AHomeComponent },
  { path: 'a-about', component: AAboutComponent },


  // ---- Admin Auth ----
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },

  // ---- Admin Pages ----
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'admin-about', component: AdminAboutComponent },
  { path: 'admin-profile', component: AdminProfileComponent },
  { path: 'manage-complaints', component: ManageComplaintsComponent },
  { path: 'manage-parking', component: ManageParkingComponent },

  // ---- Event Crud ----
  { path: 'add-event', component: AddEventComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'list-events', component: ListEventsComponent },

  // ---- Notice Crud ----
  { path: 'add-notice', component: AddNoticeComponent },
  { path: 'edit-notice/:id', component: EditNoticeComponent },
  { path: 'list-notices', component: ListNoticesComponent },

  // ---- Maintenance ----
  { path: 'list-maintenance', component: ListMaintenanceComponent },
  { path: 'pending-maintenance', component: PendingMaintenanceComponent },



  // ---- Resident CRUD ----
  { path: 'add-resident', component: AddResidentComponent },
  { path: 'edit-resident/:id', component: EditResidentComponent },
  { path: 'list-residents', component: ListResidentsComponent },

  // ---- Visitors ----
  { path: 'list-visitors', component: ListVisitorsComponent },

  // ---- Security CRUD ----
  { path: 'add-security', component: AddSecurityComponent },
  { path: 'edit-security/:id', component: EditSecurityComponent },
  { path: 'list-securities', component: ListSecuritiesComponent },

  // ---- Resident ----
  { path: 'resident-home', component: ResidentHomeComponent },
  { path: 'resident-about', component: ResidentAboutComponent },
  { path: 'resident-profile', component: ResidentProfileComponent },
  { path: 'pay-maintenance', component: PayMaintenanceComponent },
  { path: 'maintenance-details', component: MaintenanceDetailsComponent },
  { path: 'parking', component: ParkingComponent },
  { path: 'manage-visitor', component: ManageVisitorComponent },
  { path: 'list-notice-resident', component: ListNoticeResidentComponent },
  { path: 'list-event-resident', component: ListEventResidentComponent },
  // { path: 'payment-model', component: PaymentModalComponent },

  // ---- Complaints ----
  { path: 'add-complaint', component: AddComplaintComponent },
  { path: 'list-complaints', component: ListComplaintsComponent },

  // ---- Security ----
  { path: 'security-home', component: SecurityHomeComponent },
  { path: 'security-about', component: SecurityAboutComponent },
  { path: 'security-profile', component: SecurityProfileComponent },
  { path: 'add-visitor', component: AddVisitorComponent },
  { path: 'list-visitors-security', component: ListVisitorsSecurityComponent },


  // ---- Fallback ----
  { path: '**', redirectTo: 'home' }
];
