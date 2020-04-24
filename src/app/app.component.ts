import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import * as fromRoot from './+state/reducers';
import * as ApplicationActions from './+state/application/actions';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { AppService } from './_services/app.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // inactivity time in seconds
  inactivityTime = 15;
  timeLapsedSinceInactivity = 0;
  minute: number = this.padZero(0);

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  $isLoggedIn: Observable<boolean>;
  sub: Subscription;
  finalCountdown: number;

  @ViewChild('content') content: any;
  childModalRef: NgbModalRef;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private router: Router,
    private modalService: NgbModal,
    private appService: AppService,
    private store: Store<fromRoot.State>,
  ) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(10);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModalRef.close();
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      this.router.navigate(['/']);
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You have gone idle!';
      console.log(this.idleState);
      this.childModalRef = this.modalService.open(this.content);
    });

    idle.onTimeoutWarning.subscribe((countdown: number) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
      this.finalCountdown = countdown;
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.appService.getUserLoggedIn().subscribe((userLoggedIn) => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
  }

  ngOnInit() {}

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  dismiss() {
    this.childModalRef.close('hide me');
  }
  stay() {
    this.childModalRef.close('hide me');
    this.reset();
  }

  logout() {
    this.childModalRef.close('hide me');
    this.appService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }
}
