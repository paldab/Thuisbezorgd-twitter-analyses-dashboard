import { Component, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { OverlayService } from '../services/overlay.service';

@Component({
  selector: 'app-login-overlay',
  templateUrl: './login-overlay.component.html',
  styleUrls: ['./login-overlay.component.scss']
})

export class LoginOverlayComponent implements OnInit {
  
  constructor(private authService: SocialAuthService, private overlayService: OverlayService) { }

  ngOnInit(): void {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.overlayService.getRef().dispose()
  }
}
