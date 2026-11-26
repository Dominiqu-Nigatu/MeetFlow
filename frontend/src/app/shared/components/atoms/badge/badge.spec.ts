
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  let component: Badge;
  let fixture: ComponentFixture<Badge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Badge],
    }).compileComponents();

    fixture = TestBed.createComponent(Badge);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Completed');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided label', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');

    expect(badge.textContent?.trim()).toBe('Completed');
  });

  it('should use the neutral variant by default', () => {
    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');

    expect(badge.classList).toContain('badge--neutral');
  });

  it('should support different variants', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');

    expect(badge.classList).toContain('badge--success');
  });

  it('should support different sizes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');

    expect(badge.classList).toContain('badge--lg');
  });

  it('should support pill styling', () => {
    fixture.componentRef.setInput('pill', true);
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.badge');

    expect(badge.classList).toContain('badge--pill');
  });
});
