import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CarConfig, CarOption } from '../shared/models/carConfig.model';
import { Subscription } from 'rxjs';
import { CarDataService } from '../service/car-data.service';
import { SharedDataService } from '../shared/shared-data.service';
import { CarViewComponent } from '../car-view/car-view.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHOOSE_DROPDOWN, CONFIG, COST, MAX_SPEED, MILES, RANGE, SELECT_CONFIG_TEXT, STEP2, TOWHITCH, YOKE_STEERING_WHEEL } from '../shared/constant/common.constant';
import { SelectedModel } from '../shared/models/carSummary.model';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-car-config',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, CarViewComponent],
  providers: [CarDataService],
  templateUrl: './car-config.component.html',
  styleUrl: './car-config.component.scss'
})
export class CarConfigComponent {
  step2: string = STEP2;
  slectConfigText: string = SELECT_CONFIG_TEXT;
  config: string = CONFIG;
  chooseDropdown: string = CHOOSE_DROPDOWN;
  range: string = RANGE;
  miles: string = MILES;
  maxSpeed: string = MAX_SPEED;
  cost: string = COST;
  yokeSteeringWheel: string = YOKE_STEERING_WHEEL;
  towHitch: string = TOWHITCH;
  modelCode!: string;
  configs: CarConfig[] = [];
  includeYokeAvailable = false;
  includeTowHitchAvailable = false;
  selectedConfig: CarConfig | undefined;
  includeYoke = false;
  includeTowHitch = false;
  selectedModel: SelectedModel = {
    selectedCode: '',
    selectedModelDescription: '',
    selectedColorPrice: 0,
    selectedColor: '',
    selectedConfigDescription: '',
    selectedModelPrice: 0,
    selectedRange: 0,
    selectedSpeed: 0,
    selectedTowHitch: 0,
    selectedYoke: 0,
    selectedImageUrl: ''
  };
  private selectedModelSubscription: Subscription | undefined;
  imageSelected: string = '';
  selectedConfigOption: string = '';

  constructor(
    private carDataService: CarDataService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) {
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd && event.urlAfterRedirects === "/car-config"){
        this.sharedDataService.setStep3Status(false);
      }
    })
   }

  ngOnInit(): void {
    this.selectedModelSubscription = this.sharedDataService
      .getSelectedModel()
      .subscribe((selectedModel: SelectedModel | null) => {
        if (selectedModel) {
          this.modelCode = selectedModel.selectedCode;
          this.imageSelected = selectedModel.selectedImageUrl;
          //update view based on step1 selection
          this.updateSelectedCarConfig(selectedModel);
          //get remaining options from service call for yoke and towhitch
          this.getAllCarConfigOptions();
        }
      });
    //disable step3 till a value is selected
    if (this.selectedConfigOption) {
      this.sharedDataService.setStep1Status(false);
      this.sharedDataService.setStep2Status(false);
    }
  }

  //update the view with data from step1
  private updateSelectedCarConfig(selecteCardModel: SelectedModel): void {
    this.selectedModel = { ...selecteCardModel };
    if (this.selectedConfig) {
      this.selectedModel.selectedConfigDescription = this.selectedConfig.description;
      this.selectedModel.selectedModelPrice = this.selectedConfig.price;
      this.selectedModel.selectedRange = this.selectedConfig.range;
      this.selectedModel.selectedSpeed = this.selectedConfig.speed;
      this.selectedModel.selectedTowHitch = this.includeTowHitch ? 1000 : 0;
      this.selectedModel.selectedYoke = this.includeYoke ? 1000 : 0;
    }
  }

  //get other options and checkboxes data for Yoke and TowHitch
  getAllCarConfigOptions(): void {
    //get all options for the selected car model and color
    this.carDataService.getOptions(this.modelCode).subscribe({
      next: (carConfigOptions: CarOption) => {
        //set checkbox data recieved for config call
        if (carConfigOptions) {
          this.configs = carConfigOptions.configs;
          this.includeYokeAvailable = carConfigOptions.yoke;
          this.includeTowHitchAvailable = carConfigOptions.towHitch;
        }
      },
      //basic error handling
      error: (error: HttpErrorResponse) => console.error('Error fetching colors:', error)
    });
  }

  //on car config change
  onCarConfigChange(event: Event): void {
    const selectedCarConfigValue = (event.target as HTMLSelectElement).value;
    this.selectedConfigOption = '';
    //get selected car config
    const selectedCarConfig = this.configs.find(
      (model) => model.description === selectedCarConfigValue
    );
    this.selectedConfig = Object.assign({}, selectedCarConfig);
    this.selectedConfigOption = selectedCarConfigValue;
    this.setSelectedModel();
    //enable the step3 logic
    this.sharedDataService.setStep2Status(true);
    this.sharedDataService.setStep3Status(true);
  }

  //update data for step3
  setSelectedModel(): void {
    this.sharedDataService.setSelectedModel(this.selectedModel);
  }

  //cleanup unsubscribe unused data
  ngOnDestroy(): void {
    if (this.selectedModelSubscription) {
      this.selectedModelSubscription.unsubscribe();
    }
    //update data for next step 3
    this.setSelectedModel();
  }
}
