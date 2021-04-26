import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  constructor(
    private authService: SocialAuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    public utilsService: UtilsService
  ) {}

  ngOnInit(): void {
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.dialogRef.close();
    this.utilsService.reload('table/all-tweets', '/dashboard');
  }
}
