import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('btnStart') btnStart!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnStop') btnStop!: ElementRef<HTMLButtonElement>;
  @ViewChild('btnReset') btnReset!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    this.initClickListener();
  }

  initClickListener() {
    fromEvent(this.btnStart.nativeElement, 'click')
      .subscribe(() => this.startTimer());
    fromEvent(this.btnStop.nativeElement, 'click')
      .subscribe(() => this.stopTimer());
    fromEvent(this.btnReset.nativeElement, 'click')
      .subscribe(() => this.resetTimer());
  }

  startTimer() {
    console.log('start btn clicked')
  }

  stopTimer() {
    console.log('stop btn clicked')
  }

  resetTimer() {
    console.log('reset btn clicked')
  }

  


}
