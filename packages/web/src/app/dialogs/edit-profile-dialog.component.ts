import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userProfile } from 'src/app/models/userProfile';

@Component({
  selector: 'edit-profile-dialog',
  template: `
    <h1 class="mat-dialog-title">Edit</h1>
    <mat-dialog-content class="typography">
      <p>Description</p>
      <mat-form-field>
        <mat-label>Your profile description(upto 100 characters)</mat-label>
        <textarea
          maxlength="100"
          matInput
          mat-autosize
          [(ngModel)]="description"
        ></textarea>
        <mat-hint [align]="'end'">{{ description.length }} / 100</mat-hint>
      </mat-form-field>
      <br />
      <p>Profile Picture</p>
      <div class="drop-file">
        <input
          #imgInput
          accept=".jpeg, .jpg, .png"
          type="file"
          hidden
          (change)="fileChangeEvent($event)"
        />
        <image-cropper
          [imageChangedEvent]="imageChangedEvent"
          [maintainAspectRatio]="true"
          [aspectRatio]="1 / 1"
          [imageFile]="originalPhoto"
          (imageCropped)="imageCropped($event)"
          (loadImageFailed)="imgNotValid()"
        ></image-cropper>
        <button mat-button (click)="imgInput.click()">
          <mat-icon>photo</mat-icon> Browse
        </button>
        <p>{{ photoName }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-button [mat-dialog-close] (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
})
export class EditProfileDialogComponent {
  originalPhoto: File;
  newPhoto: File;
  description: string;
  photoName = '';
  imageChangedEvent: Event;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  addData($event: any): void {
    this.photoName = $event.target.files[0].name;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.addData(event);
  }
  async imageCropped(event: ImageCroppedEvent): Promise<void> {
    const blob = await (await fetch(event.base64)).blob();
    this.newPhoto = new File([blob], 'profile.png', { type: 'image/png' });
  }
  save(): void {
    this.ref.close({
      data: {
        photo: this.newPhoto,
        description: this.description,
      },
    });
  }
  cancel(): void {
    this.ref.close();
  }
  imgNotValid(): void {
    this.snackBar.open('Please provide a valid image (jpg/png)', 'Ok');
  }
  constructor(
    private ref: MatDialogRef<EditProfileDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data: userProfile
  ) {
    this.description = data.description;
  }
}
