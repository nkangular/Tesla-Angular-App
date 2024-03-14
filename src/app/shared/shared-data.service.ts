import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectedModel } from './models/carSummary.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  //Enable steps based on dropdown changes and completion status changes
  private step1Status = new BehaviorSubject<boolean>(false);
  private step2Status = new BehaviorSubject<boolean>(false);
  private step3Status = new BehaviorSubject<boolean>(false);

  step1Status$ = this.step1Status.asObservable();
  step2Status$ = this.step2Status.asObservable();
  step3Status$ = this.step3Status.asObservable();

  private selectedModelSource = new BehaviorSubject<SelectedModel | null>(null);
  selectedModel$ = this.selectedModelSource.asObservable();

  constructor() { }

  //update all steps based on drop down selections

  setStep1Status(completed: boolean): void {
    this.step1Status.next(completed);
  }

  setStep2Status(completed: boolean): void {
    this.step2Status.next(completed);
  }

  setStep3Status(completed: boolean): void {
    this.step3Status.next(completed);
  }

  getStep1Status(): boolean {
    return this.step1Status.value;
  }

  getStep2Status(): boolean {
    return this.step2Status.value;
  }

  getStep3Status(): boolean {
    return this.step3Status.value;
  }

  //store data for step2 and step3 to caliculate cost
  setSelectedModel(selectedModel: SelectedModel): void {
    this.selectedModelSource.next(selectedModel);
  }

  //get data for step2 and step3 to caliculate cost
  getSelectedModel(): Observable<SelectedModel | null> {
    return this.selectedModel$;
  }

}
