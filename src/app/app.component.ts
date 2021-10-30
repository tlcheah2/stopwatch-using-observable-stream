import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, merge, NEVER, Observable, of, Subscription } from 'rxjs';
import { mapTo, switchMap, tap } from 'rxjs/operators';


enum StopwatchAction {
  START_TIMER = 'START_TIMER',
  STOP_TIMER = 'STOP_TIMER',
  RESET_TIMER = 'RESET_TIMER'
}

interface StopwatchState {
  isCounting: boolean;
  value: number;
}

 const SECONDS_IN_HOUR = 3600;
 const SECONDS_IN_MINUTE = 60;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('btnStart') btnStart!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnStop') btnStop!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnReset') btnReset!: ElementRef<HTMLButtonElement>;

  state: StopwatchState;
  userEvents: Observable<StopwatchAction | StopwatchAction | StopwatchAction> | undefined;
  userEventsSubscription: Subscription | undefined;

  constructor() {
    this.state = {
      isCounting: false,
      value: 0
    }
  }

  ngAfterViewInit() {
    this.initClickListener();
  }

  formatTimerDisplay(seconds: number) {
    
    const hours: number = Math.floor(seconds / SECONDS_IN_HOUR );
    let remainingSeconds: number = seconds - (hours * SECONDS_IN_HOUR);

    const minutes: number = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
    remainingSeconds -= (minutes * SECONDS_IN_MINUTE);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  initClickListener() {
    // Merge all the user click event so we could centralize the state change later
    this.userEvents = merge(
      fromEvent(this.btnStart.nativeElement, 'click').pipe(mapTo(StopwatchAction.START_TIMER)),
      fromEvent(this.btnStop.nativeElement, 'click').pipe(mapTo(StopwatchAction.STOP_TIMER)),
      fromEvent(this.btnReset.nativeElement, 'click').pipe(mapTo(StopwatchAction.RESET_TIMER))
    )

    this.userEventsSubscription = this.userEvents.pipe(
      // Using switchMap here because it can restart the interval operator in the switch case when there is new click event.
      // This is perfect for stopwatch scenario
      switchMap((action) => this.handleEventAction(action))
    ).subscribe();
  }

  ngOnDestroy() {
    this.userEventsSubscription?.unsubscribe();
  }

  handleEventAction(action: StopwatchAction): Observable<any> {
    switch (action) {
      case StopwatchAction.START_TIMER: {
        return interval(1000).pipe(
          tap(_ => this.updateState({ isCounting: true, value: this.state.value + 1 }))
        )
      }
      case StopwatchAction.STOP_TIMER: {
        this.updateState({ isCounting: false, value: this.state.value });
        return NEVER;
      }
      case StopwatchAction.RESET_TIMER: {
        this.updateState({ isCounting: false, value: 0 });
        return NEVER;
      }
      default:
        return NEVER;
    }
  }
  
  updateState(state: StopwatchState) {
    this.state = { ...state };
    console.log('Updated State', this.state);
  }
}
