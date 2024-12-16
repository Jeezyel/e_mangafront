import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginSelectionGuard implements CanActivate {

  private hasSelectedPerfil = false; // Controle interno para verificar a seleção

  constructor(private router: Router, private authService: AuthService) {}

  // Método para definir se o perfil foi selecionado
  setPerfilSelected(value: boolean): void {
    console.log("Valor antigo ",this.hasSelectedPerfil);
    this.hasSelectedPerfil = value;
    console.log("Valor novo ",this.hasSelectedPerfil);
  }

  canActivate(): boolean {
    const perfilSelecionado = localStorage.getItem('perfilSelecionado');
    if (!perfilSelecionado) {
      this.router.navigate(['/select-profile']); // Redireciona caso não tenha selecionado o perfil
      return false;
    }
    return true;
  }
}