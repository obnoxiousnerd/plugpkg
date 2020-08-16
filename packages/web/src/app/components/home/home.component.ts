import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit {
  private _headerClass: string;
  get headerClass(): string {
    return this._headerClass;
  }
  set headerClass(c: string) {
    this._headerClass = c;
  }
  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(Breakpoints.Handset).subscribe((res) => {
      if (!res.matches) {
        this._headerClass = 'mat-display-4';
      } else this._headerClass = 'mat-display-3';
    });
  }
  ngOnInit(): void {
    'noop';
  }
}
