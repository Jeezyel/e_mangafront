import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-profile',
  standalone: true,
  imports: [],
  templateUrl: './select-profile.component.html',
  styleUrls: ['./select-profile.component.css']
})
export class SelectProfileComponent {
  constructor(private router: Router) {}

  selectProfile(profile: string): void {
    if (profile === 'ADMIN') {
      this.router.navigate(['/admin/login'], { queryParams: { perfil: 'ADMIN' } });
    } else if (profile === 'USER') {
      this.router.navigate(['/user/login'], { queryParams: { perfil: 'USER' } });
    }
  }
}