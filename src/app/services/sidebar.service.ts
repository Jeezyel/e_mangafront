import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sideNavToggleSubject = new BehaviorSubject<void>(undefined);

  sideNavToggle$ = this.sideNavToggleSubject.asObservable();

  toggleSidebar(): void {
    this.sideNavToggleSubject.next();
  }
}
