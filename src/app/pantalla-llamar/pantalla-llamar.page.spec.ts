import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PantallaLlamarPage } from './pantalla-llamar.page';

describe('PantallaLlamarPage', () => {
  let component: PantallaLlamarPage;
  let fixture: ComponentFixture<PantallaLlamarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaLlamarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaLlamarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
