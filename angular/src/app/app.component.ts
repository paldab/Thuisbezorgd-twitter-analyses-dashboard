import { Component } from '@angular/core';
import { SocialAuthService,GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Thuisbezorgd Insights';

  user!: SocialUser;
  loggedIn: boolean  = false;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private authService: SocialAuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }  
  ngOnInit() {
      this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if(!this.loggedIn) {
        this.openDialog()
      }
    });
  }  
  signOut(): void {
    this.authService.signOut();
  }
  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = 400
    dialogConfig.maxWidth = 600

    this.dialog.open(LoginDialogComponent, dialogConfig);
  }
}
