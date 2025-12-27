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
import { AdminAboutComponent } from './admin/admin-about/admin-about.component';
import { AddResidentComponent } from './admin/resident/add-resident/add-resident.component';
import { EditResidentComponent } from './admin/resident/edit-resident/edit-resident.component';
import { ListResidentsComponent } from './admin/resident/list-residents/list-residents.component';
import { AddVisitorComponent } from './admin/visitor/add-visitor/add-visitor.component';
import { EditVisitorComponent } from './admin/visitor/edit-visitor/edit-visitor.component';
import { ListVisitorsComponent } from './admin/visitor/list-visitors/list-visitors.component';
import { SecurityLoginComponent } from './auth/security-login/security-login.component';
import { SecurityHomeComponent } from './security/security-home/security-home.component';
import { SecurityAboutComponent } from './security/security-about/security-about.component';
import { AddSecurityComponent } from './admin/security/add-security/add-security.component';
import { EditSecurityComponent } from './admin/security/edit-security/edit-security.component';
import { ListSecuritiesComponent } from './admin/security/list-securities/list-securities.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  //----general----
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  //----admin----
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent, },
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'admin-about', component: AdminAboutComponent },

  //----crud----resident
  { path: 'add-resident', component: AddResidentComponent },
  { path: 'edit-resident/:id', component: EditResidentComponent },
  { path: 'list-residents', component: ListResidentsComponent },


  //----crud----visitor
  { path: 'add-visitor', component: AddVisitorComponent },
  { path: 'edit-visitor', component: EditVisitorComponent },
  { path: 'list-visitors', component: ListVisitorsComponent },

  //----crud----security
  { path: 'add-security', component: AddSecurityComponent },
  { path: 'list-securities', component: ListSecuritiesComponent },
  { path: 'edit-security/:id', component: EditSecurityComponent },


  //----resident----
  { path: 'resident-login', component: ResidentLoginComponent },
  { path: 'resident-home', component: ResidentHomeComponent },
  { path: 'resident-about', component: ResidentAboutComponent },

  //----visitor-----
  { path: 'visitor-login', component: VisitorLoginComponent },
  { path: 'visitor-home', component: VisitorHomeComponent },
  { path: 'visitor-about', component: VisitorAboutComponent },

    //----Security-----
  { path: 'security-login', component: SecurityLoginComponent },
  { path: 'security-home', component: SecurityHomeComponent },
  { path: 'security-about', component: SecurityAboutComponent },

  { path: '**', redirectTo: 'home' }
];
