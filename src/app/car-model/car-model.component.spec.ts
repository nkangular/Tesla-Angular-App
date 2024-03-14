import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarModelComponent } from './car-model.component';

describe('CarDetailsComponent', () => {
  let component: CarModelComponent;
  let fixture: ComponentFixture<CarModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
