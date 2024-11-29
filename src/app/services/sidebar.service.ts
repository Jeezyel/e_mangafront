import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public sideNavToggleSubject = new Subject<void>();

  public toggle(): void {
    this.sideNavToggleSubject.next();
  }

}
