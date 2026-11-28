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

  it('should render the content projection area', () => {
    expect(fixture.nativeElement.querySelector('.content-container')).toBeTruthy();
  });

  it('should render the authentication content section', () => {
    expect(fixture.nativeElement.querySelector('.auth-content')).toBeTruthy();
  });
  it('should not render decorative branding or footers', () => {
    expect(fixture.nativeElement.querySelector('aside')).toBeNull();
    expect(fixture.nativeElement.querySelector('footer')).toBeNull();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});
