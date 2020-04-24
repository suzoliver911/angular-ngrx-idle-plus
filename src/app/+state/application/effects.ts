import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { timer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import * as ApplicationActions from './actions';

@Injectable()
export class ApplicationEffects {
  APPLICATION_TIMEOUT_TIME = 1000 * 10;

  @Effect()
  extendApplicationTimeout$ = this.actions$
    .pipe(
      switchMap((action: Action) => {
        return timer(this.APPLICATION_TIMEOUT_TIME);
      }),
    )
    .pipe(
      map(() => {
        return new ApplicationActions.LogOut();
      }),
    );

  constructor(private actions$: Actions) {}
}
