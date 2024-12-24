import { Route } from "@angular/router";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockedComponent } from "./locked/locked.component";
import { Page404Component } from "./page404/page404.component";
import { Page500Component } from "./page500/page500.component";
import { DashboardComponent as DoctorDashboardComponent } from '../doctor/dashboard/dashboard.component'; // Adjust the path based on your project structure
import { DashboardComponent as PatientDashboardComponent } from '../patient/dashboard/dashboard.component'; // Adjust path as necessary
import { AuthGuard } from './signin/auth.guard';

export const AUTH_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full",
  },
  {
    path: "signin",
    component: SigninComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "locked",
    component: LockedComponent,
  },
  {
    path: "page404",
    component: Page404Component,
  },
  {
    path: "page500",
    component: Page500Component,
  },
  {
    path: 'doctor',
    component: DoctorDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'doctor' }  // Only accessible by users with the 'doctor' role
  },
  {
    path: 'patient',
    component: PatientDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'patient' }  // Only accessible by users with the 'patient' role
  },
  {
    path: 'login',
    component: SigninComponent
  },
];
