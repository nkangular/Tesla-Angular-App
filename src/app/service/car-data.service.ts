
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CarOption } from '../shared/models/carConfig.model';
import { CarModel } from '../shared/models/carModel.model';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private optionsUrl = '/options';
  private modelsUrl = '/models';

  constructor(private http: HttpClient) { }

  getOptions(modelCode: string): Observable<CarOption> {
    return this.http.get<CarOption>(`${this.optionsUrl}/${modelCode}`);
  }

  getCarModels(): Observable<CarModel> {
    return this.http.get<CarModel>(`${this.modelsUrl}`);
  }

}
