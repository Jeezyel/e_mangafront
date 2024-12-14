import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isSidebarVisible: boolean = true; // Estado inicial da sidebar
  
  homeRoutes = [
    { path: 'ecommerce', label: 'Catálogo', icon: 'shopping_cart' },
  ];

  userRoutes = [
    { path: 'ecommerce', label: 'Catálogo', icon: 'shopping_cart' },
    { path: 'usuario', label: 'Usuário', icon: 'person' },
  ];

  adminRoutes = [
    { path: 'estados', label: 'Estados', icon: 'map' },
    { path: 'municipios', label: 'Municípios', icon: 'location_city' },
    //{ path: 'enderecos', label: 'Endereços', icon: 'place' },
    //{ path: 'telefones', label: 'Telefones', icon: 'phone' },
    { path: 'editoras', label: 'Editoras', icon: 'library_books' },
    { path: 'formatos', label: 'Formatos', icon: 'view_module' },
    { path: 'generos', label: 'Gêneros', icon: 'category' },
    { path: 'idiomas', label: 'Idiomas', icon: 'language' },
    { path: 'mangas', label: 'Mangás', icon: 'menu_book' },
  ];

  routesToDisplay: { path: string; label: string; icon: string }[] = [];
  
  constructor(private router: Router, private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.updateRoutes();

    // Escuta as alterações de estado do SidebarService
    this.sidebarService.sideNavToggle$.subscribe(() => {
      this.isSidebarVisible = !this.isSidebarVisible;
    });

    // Atualiza as rotas ao mudar de template
    this.router.events.subscribe(() => {
      this.updateRoutes();
    });
  }

  updateRoutes(): void {
    if (this.router.url.startsWith('/admin')) {
      this.routesToDisplay = this.filterAdminRoutes();
    } else if (this.router.url.startsWith('/user')) {
      this.routesToDisplay = this.userRoutes;
    } else {
      this.routesToDisplay = this.homeRoutes;
    }
  }

  filterAdminRoutes(): { path: string; label: string; icon: string }[] {
    return this.adminRoutes.filter(
      route => !route.path.includes('/new') && !route.path.includes('/edit')
    );
  }

}