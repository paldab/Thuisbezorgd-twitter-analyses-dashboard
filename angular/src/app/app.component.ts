import { Component } from '@angular/core';
import { SocialAuthService,GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { OverlayService } from './services/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Thuisbezorgd Insights';

  // signinForm: FormGroup | undefined;
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
    private loginOverlay: OverlayService,
  ) { }  
  ngOnInit() {
      this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);

      if(!this.loggedIn) {
        this.loginOverlay.open({width: 800, height: 800});
      }
    });
  }  
  signOut(): void {
    this.authService.signOut();
  }

}
