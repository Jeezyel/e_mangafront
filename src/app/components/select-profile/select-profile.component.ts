import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSelectionGuard } from '../guard/home-auth.guard';
import { AuthService } from '../../services/auth.service';

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
    private loginSelectionGuard: LoginSelectionGuard,
    private authService: AuthService
  ) {}

  selectProfile(profile: string): void {
    localStorage.setItem('perfilSelecionado', profile); // Salva o perfil no localStorage
    this.router.navigate(['/login'], { state: { perfil: profile } });
  }

}