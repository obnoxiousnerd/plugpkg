import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'register-scope-dialog',
  styles: [
    `
      .write-access-users-input {
        width: 100%;
      }
    `,
  ],
  template: `<div>
    <h1 class="mat-dialog-title">Create a scope</h1>
    <mat-form-field>
      <mat-label>Enter a cool name for your scope</mat-label>
      <input [(ngModel)]="scopeName" type="text" matInput required />
    </mat-form-field>
    <br />
    <br />
    <mat-form-field class="write-access-users-input">
      <mat-label>
        Usernames that can publish code on this scope
      </mat-label>
      <mat-chip-list #userChipList>
        <mat-chip>You ({{ scopeOwner }})</mat-chip>
        <mat-chip
          *ngFor="let user of writeAccessUsers"
          [selectable]="selectable"
          [removable]="removable"
          (removed)="removeUser(user)"
        >
          {{ user }}
          <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
        </mat-chip>
        <input
          matInput
          [matChipInputFor]="userChipList"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="addUser($event)"
        />
      </mat-chip-list>
    </mat-form-field>
    <br />
    <button mat-button (click)="cancel()">Cancel</button>
    <button mat-button (click)="save()">Save</button>
  </div>`,
})
export class RegisterScopeDialogComponent implements OnInit {
  @Input() scopeName = '';
  scopeOwner = '';
  writeAccessUsers: string[] = [];
  readonly separatorKeysCodes: number[] = [13, 188, 32];
  selectable = true;
  removable = true;

  addUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value && value.trim()) this.writeAccessUsers.push(value.trim());
    if (input) input.value = '';
  }
  removeUser(user: string): void {
    const index = this.writeAccessUsers.indexOf(user);
    this.writeAccessUsers.splice(index, 1);
  }
  // userNamesToUIDs(displayNames: string[]): string[] {}
  save(): void {
    this.ref.close({
      name: this.scopeName,
      owner: this.scopeOwner,
      writeAccessUsers: [...this.writeAccessUsers],
    });
  }
  cancel(): void {
    this.ref.close();
  }
  async ngOnInit(): Promise<void> {
    this.scopeOwner = (await this.afAuth.currentUser).displayName;
  }
  constructor(
    private ref: MatDialogRef<RegisterScopeDialogComponent>,
    private afAuth: AngularFireAuth
  ) {}
}
