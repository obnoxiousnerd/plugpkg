import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SigninComponent } from './components/signin/signin.component';

import { ImageCropperModule } from 'ngx-image-cropper';

import { AngularFireModule, FirebaseOptions } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AuthService } from './services/auth.service';
import { LoaderService } from './services/loader.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditProfileDialogComponent } from './dialogs/edit-profile-dialog.component';
import { RegisterScopeDialogComponent } from './dialogs/register-scope-dialog.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AsteriskPipe } from './pipes/asterisk.pipe';
import { APIHttpInterceptorProvider } from './interceptors/api-interceptor';
import { RestService } from './services/rest.service';
import { HttpClientModule } from '@angular/common/http';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyC9PdEDOZwBGvI3lmj5HVsZw0eeJ40_zgA',
  authDomain: 'plugpkg.firebaseapp.com',
  databaseURL: 'https://plugpkg.firebaseio.com',
  projectId: 'plugpkg',
  storageBucket: 'plugpkg.appspot.com',
  messagingSenderId: '208908821187',
  appId: '1:208908821187:web:ba05cab58fd4f092aab876',
  measurementId: 'G-1SBZVNX3X5',
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SigninComponent,
    DashboardComponent,
    EditProfileDialogComponent,
    RegisterScopeDialogComponent,
    AsteriskPipe,
  ],
  entryComponents: [EditProfileDialogComponent, RegisterScopeDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialDesignModule,
    LayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ImageCropperModule,
  ],
  providers: [
    AuthService,
    AngularFireAuthGuard,
    LoaderService,
    RestService,
    APIHttpInterceptorProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
