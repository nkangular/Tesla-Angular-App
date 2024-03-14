import { Component } from '@angular/core';
import { CHOOSE_DROPDOWN, COLOR, CORE_URL, MODEL, SELECT_MODEL_TEXT, STEP1 } from '../shared/constant/common.constant';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from '../shared/shared-data.service';
import { CarDataService } from '../service/car-data.service';
import { CarColor, CarModel } from '../shared/models/carModel.model';
import { CommonModule } from '@angular/common';
import { CarViewComponent } from '../car-view/car-view.component';
import { SelectedModel } from '../shared/models/carSummary.model';

@Component({
  selector: 'app-car-model',
  standalone: true,
  imports: [HttpClientModule, CommonModule, CarViewComponent],
  providers: [CarDataService],
  templateUrl: './car-model.component.html',
  styleUrl: './car-model.component.scss'
})
export class CarModelComponent {
  carColors: CarColor[] = [];
  carColorText: string = COLOR;
  chooseDropDownText: string = CHOOSE_DROPDOWN;
  carModelText: string = MODEL;
  carModels!: CarModel[];
  selectedCarImage: string = '';
  selectModelText: string = SELECT_MODEL_TEXT;
  selectedModelArray: CarModel[] = [];
  selectedModel: string = '';
  selectedColor: string = '';
  stepperText1: string = STEP1;
  coreUrl: string = CORE_URL;
  constructor(
    private sharedDataService: SharedDataService,
    private carDataService: CarDataService
  ) { }

  ngOnInit(): void {
    //get all cars from mock server
    this.getAllCars();
    //logic to handle disbale steps
    if (!this.selectedModel) {
      this.sharedDataService.setStep1Status(false);
    }
  }

  getAllCars(): void {
    //get all cars from car service
    this.carDataService.getCarModels().subscribe({
      next: (carModelData: CarModel[] | CarModel) => {
        if (Array.isArray(carModelData)) {
          this.carModels = carModelData;
        }
      },
      //handle error
      error: (error: HttpErrorResponse) => console.error('Error fetching colors:', error)
    });
  }

  //on car model drop down change 
  onCarModelChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedModelArray = [];
    //get the slected car model from list of models
    const selectedCarModel = this.carModels.find(
      (model) => model.description === selectedValue
    );
    //push the selected model to display the first item using code
    if (selectedCarModel) {
      this.selectedModelArray.push(selectedCarModel);
    }

    //assign value of model
    this.selectedModel = selectedValue;
    this.selectedColor = '';

    //update car image for the default color for model
    if (selectedCarModel) {
      this.carColors = selectedCarModel.colors;
      if (this.carColors?.length) {
        this.selectedColor = this.carColors[0].description;
        this.updateCarImage(selectedCarModel.code, this.carColors[0].code);
      }
    }
    //step handler for disable and enable step2
    this.sharedDataService.setStep1Status(true);
    this.sharedDataService.setStep3Status(false);
  }

  //on car color drop down change
  onCarColorChange(event: Event): void {
    const selectedCarColorValue = (event.target as HTMLSelectElement).value;

    //get the slected car color from list of colors
    const filteredSelectedColor = this.carColors.find(
      (color) => color.description === selectedCarColorValue
    );

    //update car image for the default color for model
    this.selectedColor = selectedCarColorValue;
    if (filteredSelectedColor) {
      this.updateCarImage(
        this.selectedModelArray[0].code,
        filteredSelectedColor.code
      );
    }
  }

  //update the car image based on color and model selection
  private updateCarImage(carModel: string, carColor: string): void {
    this.selectedCarImage = `${this.coreUrl}/${carModel}/${carColor}.jpg`;
    this.setSelectedCarData();
  }

  //set selected car model for step2 and step 3 using common service
  private setSelectedCarData(): void {
    //get selected model of car
    const selectedModel = this.carModels.find(
      (model) => model.description === this.selectedModel
    );
    //get selected color of car
    const selectedColor = this.carColors.find(
      (color) => color.description === this.selectedColor
    );
    if (selectedModel && selectedColor) {
      const selectedModelData: SelectedModel = {
        selectedCode: selectedModel.code,
        selectedModelDescription: this.selectedModel,
        selectedColor: this.selectedColor,
        selectedConfigDescription: '',
        selectedModelPrice: 0,
        selectedColorPrice: selectedColor.price || 0,
        selectedRange: 0,
        selectedSpeed: 0,
        selectedTowHitch: 0,
        selectedYoke: 0,
        selectedImageUrl: this.selectedCarImage
      };
      //update the data in common service for step2 and step3
      this.sharedDataService.setSelectedModel(selectedModelData);
    }
  }

}
