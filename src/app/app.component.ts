import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assignment8';
  @ViewChild('Back_res') Back_res: ElementRef<HTMLElement> | undefined;
  notice(){
    // @ts-ignore
    let el: HTMLElement = this.Back_res.nativeElement;
    el.click();
  }
}
