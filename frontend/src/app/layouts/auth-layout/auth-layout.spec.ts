import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthLayout } from './auth-layout';

describe('AuthLayout', () => {
  let component: AuthLayout;
  let fixture: ComponentFixture<AuthLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLayout);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the MeetFlow brand', () => {
    expect(fixture.nativeElement.textContent).toContain('MeetFlow');
  });

  it('should display the brand headline', () => {
    expect(fixture.nativeElement.textContent).toContain('Less meeting chaos.');
  });

  it('should display the brand tagline', () => {
    expect(fixture.nativeElement.textContent).toContain('Summarise. Organise. Get things done.');
  });

  it('should render the content projection area', () => {
    expect(fixture.nativeElement.querySelector('.content-container')).toBeTruthy();
  });

  it('should render the branding section', () => {
    expect(fixture.nativeElement.querySelector('.auth-brand')).toBeTruthy();
  });

  it('should render the authentication content section', () => {
    expect(fixture.nativeElement.querySelector('.auth-content')).toBeTruthy();
  });
});
