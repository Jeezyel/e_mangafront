import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importações necessárias
import { CommonModule } from '@angular/common'; // Necessário para *ngIf
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { SidebarService } from '../../../services/sidebar.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbar, MatIcon, MatIconButton],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  usuarioLogado: Usuario | null = null; // Propriedade para o usuário logado
  private subscription = new Subscription(); // Gerencia assinaturas RxJS
  exibirSidebar: boolean = true; // Propriedade adicionada para controlar o Sidebar

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router // Injeta o Router para monitorar mudanças de rota
  ) {}

  ngOnInit(): void {
    // Atualiza o estado do usuário logado
    this.subscription.add(
      this.authService.getUsuarioLogado().subscribe((usuario) => (this.usuarioLogado = usuario))
    );

    // Monitora mudanças de rota para controlar a exibição do Sidebar
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.exibirSidebar = !event.url.includes('/admin/login');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Cancela assinaturas ao destruir o componente
  }

  clickMenu(): void {
    this.sidebarService.toggle(); // Alterna o Sidebar
  }

  onLogout(): void {
    localStorage.removeItem('token'); // Remove o token de autenticação
    this.authService.logout(); // Chama o logout no AuthService
    this.router.navigate(['/admin/login']).then(() => {
      console.log('Redirecionado para /admin/login');
    }).catch((err) => {
      console.error('Erro no redirecionamento:', err);
    });
  }

  public onToggleSidebar(): void {
    this.sidebarService.toggle(); // Alterna o Sidebar
  }
}
