import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabContactosPage } from './tabContactos.page';

describe('TabContactosPage', () => {
  let component: TabContactosPage;
  let fixture: ComponentFixture<TabContactosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabContactosPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
