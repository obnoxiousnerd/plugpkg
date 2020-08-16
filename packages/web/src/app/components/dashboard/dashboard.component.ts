import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { userProfile } from 'src/app/models/userProfile';
import { provideErrMessage } from 'src/app/functions/errMessage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoaderService } from 'src/app/services/loader.service';
import { RestService, UserScopesRes } from 'src/app/services/rest.service';
import { EditProfileDialogComponent } from 'src/app/dialogs/edit-profile-dialog.component';
import { RegisterScopeDialogComponent } from 'src/app/dialogs/register-scope-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  user: Partial<User> = {};
  userProfileSnap: DocumentSnapshot<userProfile>;
  userProfile: userProfile = {
    displayName: null,
    email: null,
    description: null,
  };
  hasError: boolean;
  errorMsg: string;
  accessToken: string;
  userScopes: UserScopesRes = undefined;
  constructor(
    public dialog: MatDialog,
    private afauth: AngularFireAuth,
    private bucket: AngularFireStorage,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private rest: RestService,
    private loader: LoaderService
  ) {}
  async ngOnInit(): Promise<void> {
    try {
      this.user = await this.afauth.currentUser;
      const userProfile = this.rest.getDocFromFirestore<userProfile>(
        `/users/${this.user.uid}`
      );
      userProfile.subscribe((doc) => {
        this.userProfileSnap = doc as DocumentSnapshot<userProfile>;
        this.userProfile = doc.data();
      });
      this.userScopes = await this.rest.getUserScopes(this.user.uid);
      if (this.userScopes.message === 'User is not registered in any scope') {
        this.userScopes = null;
      } else {
      }
    } catch (e) {
      if (e) {
        this.hasError = true;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.errorMsg = `${e.code || ''}: ${e.message || e}`;
        this.snackBar.open(provideErrMessage(e), 'Ok');
      }
    }
  }
  async getAccessToken(): Promise<void> {
    const tokenObj = await this.rest.getAccessToken({
      uid: (await this.afauth.currentUser).uid,
    });
    this.accessToken = tokenObj.token;
  }
  async copyAccessToken(): Promise<void> {
    await this.getAccessToken();
    navigator.clipboard.writeText(this.accessToken);
    this.snackBar.open('Copied!', 'Cool', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  registerScope(): void {
    const registerScopeDialog = this.dialog.open(RegisterScopeDialogComponent, {
      width: '50%',
    });
    registerScopeDialog.afterClosed().subscribe((data) => {
      if (!data) return;
      console.log(data);
    });
  }
  editProfile(): void {
    const editProfileDialog = this.dialog.open(EditProfileDialogComponent, {
      width: '50%',
      data: { description: this.userProfile.description },
    });
    editProfileDialog.afterClosed().subscribe((res): void => {
      if (!res) return;
      if (res.data.description) {
        this.loader.loaderEvent.emit(true);
        this.db
          .doc(`users/${this.user.uid}`)
          .set({ description: res.data.description }, { merge: true })
          .then(() => {
            this.loader.loaderEvent.emit(false);
          })
          .catch((e) => {
            this.loader.loaderEvent.emit(false);
            this.snackBar.open(e.message || e, 'Ok');
          });
      }
      if (res.data.photo) {
        this.loader.loaderEvent.emit(true);
        const file: File = res.data.photo;
        this.bucket
          .upload(`users/${this.user.uid}/${file.name}`, file)
          .then(async (snap) => {
            this.db
              .doc(`users/${this.user.uid}`)
              .set(
                { photoURL: await snap.ref.getDownloadURL() },
                { merge: true }
              )
              .then(async () => {
                this.user.updateProfile({
                  photoURL: await snap.ref.getDownloadURL(),
                });
              })
              .then(() => {
                this.snackBar.open(
                  'Successfully updated profile picture.',
                  'Ok'
                );
                this.loader.loaderEvent.emit(false);
              })
              .catch((err) => {
                this.snackBar.open(provideErrMessage(err), 'Ok');
                this.loader.loaderEvent.emit(false);
              });
          });
      }
    });
  }
}
