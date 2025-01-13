import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicItemComponent } from './comic-item.component';

describe('ComicItemComponent', () => {
  let component: ComicItemComponent;
  let fixture: ComponentFixture<ComicItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
