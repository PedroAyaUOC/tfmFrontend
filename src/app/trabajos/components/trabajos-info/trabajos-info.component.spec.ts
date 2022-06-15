import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosInfoComponent } from './trabajos-info.component';

describe('TrabajosInfoComponent', () => {
  let component: TrabajosInfoComponent;
  let fixture: ComponentFixture<TrabajosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajosInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
