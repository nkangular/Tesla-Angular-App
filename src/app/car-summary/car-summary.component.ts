import { Component } from '@angular/core';
import { CarViewComponent } from '../car-view/car-view.component';
import { CommonModule } from '@angular/common';
import { CarDataService } from '../service/car-data.service';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../shared/shared-data.service';
import { COLOR, MAX_SPEED, MILES, RANGE, STEP3, SUMMARY, TESLA_TEXT, TOTAL_COST, TOW_HITCH_PACKAGE, YOKE_STEERING_WHEEL } from '../shared/constant/common.constant';
import { SelectedModel } from '../shared/models/carSummary.model';

@Component({
  selector: 'app-car-summary',
  standalone: true,
  imports: [CommonModule, CarViewComponent],
  providers: [CarDataService],
  templateUrl: './car-summary.component.html',
  styleUrl: './car-summary.component.scss'
})
export class CarSummaryComponent {
  selectedModel: SelectedModel | null = null;
  totalCost: number = 0;
  private selectedModelSubscription: Subscription | undefined;
  selectedCarImage: string = '';
  stepperText3: string = STEP3;
  summary: string = SUMMARY;
  range: string = RANGE;
  maxSpeed: string = MAX_SPEED;
  miles: string = MILES;
  color: string = COLOR;
  towHitchPackage: string = TOW_HITCH_PACKAGE;
  yokeSteeringWheel: string = YOKE_STEERING_WHEEL;
  totalCostText: string = TOTAL_COST;
  teslaText: string = TESLA_TEXT;

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit(): void {
    //get all saved car config data from step1 and step2 and calculate cost
    this.selectedModelSubscription = this.sharedDataService
      .getSelectedModel()
      .subscribe((selectedModel: SelectedModel | null) => {
        if (selectedModel) {
          this.selectedModel = selectedModel;
          this.selectedCarImage = selectedModel.selectedImageUrl;
          this.updateCarCost();
        }
      });
  }

  //calculate total car cost based on step1 and step2 selections which are stored in shared service
  updateCarCost(): void {
    let totalCarCost = 0;
    if (this.selectedModel) {
      totalCarCost += this.selectedModel.selectedColorPrice || 0;
      totalCarCost += this.selectedModel.selectedModelPrice || 0;
      totalCarCost += this.selectedModel.selectedTowHitch || 0;
      totalCarCost += this.selectedModel.selectedYoke || 0;
    }
    this.totalCost = totalCarCost;
  }

  //unsubscribe to unused data
  ngOnDestroy(): void {
    if (this.selectedModelSubscription) {
      this.selectedModelSubscription.unsubscribe();
    }
  }

}
