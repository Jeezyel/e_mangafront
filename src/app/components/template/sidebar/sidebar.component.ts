import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    MatSidenavModule, // Para mat-drawer e mat-drawer-container
    MatListModule,    // Para mat-list e mat-list-item
    RouterModule      // Para routerLink e router-outlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarComponent implements OnInit, AfterViewInit {
  transformState: string = 'void';
  @ViewChild('drawer') public drawer!: MatDrawer;

  constructor(private sidebarService: SidebarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Nada a inicializar no momento
  }

  ngAfterViewInit(): void {
    this.sidebarService.sideNavToggle$.subscribe(() => {
      if (this.drawer) {
        this.drawer.toggle();
        this.updateTransformState();
      } else {
        console.error('Drawer não inicializado!');
      }
    });
  }

  public toggle(): void {
    if (this.drawer) {
      this.drawer.toggle();
      this.updateTransformState();
    } else {
      console.error('Drawer não inicializado no toggle()!');
    }
  }

  private updateTransformState(): void {
    Promise.resolve().then(() => {
      if (this.drawer) {
        this.transformState = this.drawer.opened ? 'open' : 'void';
        this.cdr.detectChanges(); // Força o Angular a reconhecer a mudança
      }
    });
  }
}
