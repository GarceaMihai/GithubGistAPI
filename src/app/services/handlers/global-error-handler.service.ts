import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {SNACKBAR_DURATION} from "../../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) {
  }

  handleError(error: any): void {
    let message = '';
    if (error.status == 500) {
      message = 'Something went wrong.'
    } else if (error.status == 404) {
      message = 'Resource not found.';
    }
    if(message !== '') {
      this.openSnackBar(message);
    }
  }

  openSnackBar(message: string): void {
    this.zone.run(() => {
      const snackBar = this.snackBar.open(message, "Close", {
        duration: SNACKBAR_DURATION,
        verticalPosition: 'bottom'
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      })
    });
  }
}
