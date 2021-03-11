import { Component, HostBinding } from '@angular/core';
import { SocialAuthService,GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { FormControl } from '@angular/forms';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') className = '';
  title = 'Thuisbezorgd Insights';
  toggleControl = new FormControl(false)
  user!: SocialUser;
  loggedIn: boolean  = false;
  isDarkTheme: boolean = false;



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private authService: SocialAuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private overlay: OverlayContainer

  ) { }  
  ngOnInit() {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      let body = document.getElementsByTagName('body')[0];
      if (darkMode) {
        body.classList.add("darkBG");
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        body.classList.remove("darkBG");
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });

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
