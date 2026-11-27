import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  let component: Skeleton;
  let fixture: ComponentFixture<Skeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skeleton],
    }).compileComponents();

    fixture = TestBed.createComponent(Skeleton);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use text variant by default', () => {
    expect(component.variant()).toBe('text');
  });

  it('should support circular variant', () => {
    fixture.componentRef.setInput('variant', 'circular');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.skeleton--circular')).toBeTruthy();
  });

  it('should support rectangular variant', () => {
    fixture.componentRef.setInput('variant', 'rectangular');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.skeleton--rectangular')).toBeTruthy();
  });

  it('should support custom width', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.skeleton');
    expect(skeleton.style.width).toBe('200px');
  });

  it('should support custom height', () => {
    fixture.componentRef.setInput('height', '50px');
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.skeleton');
    expect(skeleton.style.height).toBe('50px');
  });

  it('should animate by default', () => {
    expect(fixture.nativeElement.querySelector('.skeleton--animated')).toBeTruthy();
  });

  it('should allow animation to be disabled', () => {
    fixture.componentRef.setInput('animated', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.skeleton--animated')).toBeFalsy();
  });

  it('should be hidden from screen readers', () => {
    const skeleton = fixture.nativeElement.querySelector('.skeleton');
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
  });
});
