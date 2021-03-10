import { Component, HostBinding } from '@angular/core';
import { SocialAuthService,GoogleLoginProvider, SocialUser } from 'angularx-social-login';

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

  constructor(private authService: SocialAuthService) { }  
  ngOnInit() {
      this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(this.user);
    });
  }  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.authService.signOut();
  }

}
