import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDrawer, MatDrawerContainer, MatDrawerContent, MatSidenav } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatList, MatListItem, MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'; // Adicionado
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenav, MatDrawer, MatDrawerContainer, RouterModule,
    MatDrawerContent, MatToolbar, MatList, MatNavList, MatListItem, RouterOutlet, MatIconModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Corrigi o nome de 'styleUrl' para 'styleUrls'
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    // Eventos do serviço serão registrados após a inicialização da visualização
  }

  ngAfterViewInit(): void {
    this.sidebarService.sideNavToggleSubject.subscribe(() => {
      if (this.drawer) {
        this.drawer.toggle();
      } else {
        console.error('Drawer não inicializado!');
      }
    });
  }

  public toggle(): void {
    if (this.drawer) {
      this.drawer.toggle();
    } else {
      console.error('Drawer não inicializado no toggle()!');
    }
  }
}