import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'; // Para usar o ícone do Angular Material
import { MatButtonModule } from '@angular/material/button'; // Para o botão do ícone

import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-template',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MatIconModule,
    MatButtonModule // Import necessário para o botão do ícone
  ],
  templateUrl: './home-template.component.html',
  styleUrls: ['./home-template.component.css']
})
export class HomeTemplateComponent implements OnInit {

  exibirSidebar: boolean = true; // Propriedade para controlar o estado do Sidebar

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Define o estado inicial do Sidebar com base na URL atual
    this.atualizarExibicaoSidebar(this.router.url);

    // Monitora mudanças de rota e atualiza o estado do Sidebar
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.atualizarExibicaoSidebar(event.url);
      }
    });
  }

  private atualizarExibicaoSidebar(url: string): void {
    this.exibirSidebar = !url.includes('/user/login'); // Esconde o Sidebar na rota de login
    console.log(`URL atual: ${url}, exibirSidebar: ${this.exibirSidebar}`);
  }

}
