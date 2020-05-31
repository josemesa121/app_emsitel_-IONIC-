import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ValidarCodigoPage } from './validar-codigo.page';

describe('ValidarCodigoPage', () => {
  let component: ValidarCodigoPage;
  let fixture: ComponentFixture<ValidarCodigoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidarCodigoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidarCodigoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
