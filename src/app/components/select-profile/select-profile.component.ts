import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSelectionGuard } from '../guard/home-auth.guard';

@Component({
  selector: 'app-select-profile',
  standalone: true,
  imports: [],
  templateUrl: './select-profile.component.html',
  styleUrls: ['./select-profile.component.css']
})
export class SelectProfileComponent {
  constructor(
    private router: Router,
    private loginSelectionGuard: LoginSelectionGuard
  ) {}

  selectProfile(profile: string): void {
    this.loginSelectionGuard.setPerfilSelected(true); 
    this.router.navigate(['/login'], { state: { perfil: profile } });
  }

}