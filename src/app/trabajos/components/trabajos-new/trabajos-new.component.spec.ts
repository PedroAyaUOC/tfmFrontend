import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosNewComponent } from './trabajos-new.component';

describe('TrabajosNewComponent', () => {
  let component: TrabajosNewComponent;
  let fixture: ComponentFixture<TrabajosNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajosNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajosNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
