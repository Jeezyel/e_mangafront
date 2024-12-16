import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
    
    const authService = inject(AuthService);
    const router = inject(Router);
  
    if (authService.isTokenExpired()) {
  
      // Token inválido
  
      authService.removeToken();
      authService.removeUsuarioLogado();
      router.navigate(['/select-profile']);
      return false;
    } 
    
    const userLogado = authService.getUsuarioLogadoValue(); 
  
    if (userLogado?.perfil?.id === 2) {
      router.navigate(['/login']);
      return false;
    }
  
    return true;

};