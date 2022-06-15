import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosListComponent } from './trabajos-list.component';

describe('TrabajosListComponent', () => {
  let component: TrabajosListComponent;
  let fixture: ComponentFixture<TrabajosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
