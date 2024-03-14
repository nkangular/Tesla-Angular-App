import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { STEP1, STEP2, STEP3 } from './shared/constant/common.constant';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SharedDataService } from './shared/shared-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  stepperText1: string = STEP1;
  stepperText2: string = STEP2;
  stepperText3: string = STEP3;

  step1Status = false;
  step2Status = false;
  step3Status = false;

  constructor(private sharedDataService: SharedDataService, private router: Router) {
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd && event.urlAfterRedirects === "/car-model"){
        this.sharedDataService.setStep2Status(false);
        this.sharedDataService.setStep3Status(false);
      }
    })
  }

  ngOnInit(): void {
    this.sharedDataService.step1Status$.subscribe(status => {
      this.step1Status = status;
    });
    this.sharedDataService.step2Status$.subscribe(status => {
      this.step2Status = status;
    });
    this.sharedDataService.step3Status$.subscribe(status => {
      this.step3Status = status;
    });
  }

}
