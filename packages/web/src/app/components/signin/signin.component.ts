import { Component, OnInit, Input } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/auth';

interface signInOpts {
  email: string;
}
interface signUpOpts {
  email: string;
  pass: string;
  username: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.sass'],
})
export class SigninComponent implements OnInit {
  @Input() signInOpts: signInOpts = { email: '' };
  @Input() signUpOpts: signUpOpts = { email: '', pass: '', username: '' };
  protected emailSent = false;
  constructor(
    public AuthService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  async ngOnInit(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.router.navigate(['dashboard']);
      this.snackBar.open(
        `You were redirected because you're already signed in.`,
        'Ok'
      );
    } else {
      await this.signIn(window.location.href);
    }
  }
  async sendSignInLink(): Promise<void> {
    this.emailSent = true;
    await this.afAuth.sendSignInLinkToEmail(
      this.signInOpts.email,
      this.AuthService.sendEmailLinkOptions
    );
    window.localStorage.setItem('signInEmail', this.signInOpts.email);
    this.snackBar.open(
      `A link has been sent to you on ${this.signInOpts.email} for signing-in`,
      'Ok'
    );
  }
  async signIn(url: string): Promise<void> {
    try {
      if (await this.afAuth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('signInEmail');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        this.AuthService.signInWithEmail(email, url);
      }
    } catch (error) {
      this.snackBar.open(error.message || error, 'Ok');
    }
  }
  signUp(): void {
    this.AuthService.signUp(
      this.signUpOpts.email,
      this.signUpOpts.username,
      this.signUpOpts.pass
    );
  }
}
