import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellSelectorComponent } from './cell-selector.component';

describe('CellSelectorComponent', () => {
  let component: CellSelectorComponent;
  let fixture: ComponentFixture<CellSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CellSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
