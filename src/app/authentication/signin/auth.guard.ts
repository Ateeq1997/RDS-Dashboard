import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Ensure this path is correct based on your project structure

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    // Check if the user is logged in and their role matches the route's required role
    if (currentUser && currentUser['role'] === route.data['role']) {
      return true;
    }

    // Redirect to login if the role does not match
    this.router.navigate(['/login']);
    return false;
  }
}
