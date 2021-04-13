import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private router: Router) { }
  
  reload(origin: string, route: string) {
    this.router.navigateByUrl(origin, { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(route);
    }); 
  }
}
