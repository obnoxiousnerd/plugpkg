import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  loggedIn = false;
  sendEmailLinkOptions: firebase.auth.ActionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  constructor(
    private afauth: AngularFireAuth,
    private bucket: AngularFireStorage,
    private router: Router,
    private db: AngularFirestore,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar
  ) {
    this.user = afauth.user;
    this.user.subscribe((user) => {
      if (user) {
        this.userDetails = user;
        this.loggedIn = true;
      } else {
        this.userDetails = null;
        this.loggedIn = false;
      }
    });
  }
  signInWithEmail(email: string, emailLink: string): void {
    this.loaderService.start();
    this.afauth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        try {
          const user = await this.afauth.signInWithEmailLink(email, emailLink);
          this.userDetails = user.user;
          if (!this.db.collection('users').doc(this.userDetails.uid))
            this.db
              .collection('users')
              .doc(this.userDetails.uid)
              .set({
                name: this.userDetails.displayName,
                joined: new Date().toUTCString(),
              })
              .catch((e) => this.snackBar.open(e.message, 'Ok'));
          await this.router.navigate(['/dashboard']);
          this.loaderService.stop();
        } catch (e_1) {
          this.loaderService.stop();
          return this.snackBar.open(e_1.message, 'Ok');
        }
      });
  }
  signUp(email: string, username: string, pass: string): void {
    this.loaderService.start();
    this.afauth
      .createUserWithEmailAndPassword(email, pass)
      .then(async (res) => {
        this.snackBar.open('Creating your account, hang tight.', 'Ok');
        await this.afauth.signInWithEmailAndPassword(email, pass);
        await res.user.updateProfile({
          displayName: username,
          photoURL: await this.bucket.storage
            .ref('img/default-user.png')
            .getDownloadURL(),
        });
        await this.db.collection('users').doc(res.user.uid).set({
          displayName: username,
          email: email,
          photoURL: res.user.photoURL,
          description:
            'Apparently, this user prefers to keep suspense about them.',
        });
        const createAccessToken = firebase
          .app()
          .functions()
          .httpsCallable('createAccessToken');
        this.userDetails = await this.afauth.currentUser;
        await createAccessToken({
          email: email,
          pass: pass,
          username: username,
        });
        await this.router.navigate(['/dashboard']);
        this.loaderService.stop();
      })
      .catch((err) => {
        this.snackBar.open(err.message, 'Ok');
        this.loaderService.stop();
      });
  }
  logout(): void {
    this.afauth.signOut().then(() => this.router.navigate(['/']));
  }
}
