import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Avatar],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default initials', () => {
    const initials = fixture.nativeElement.querySelector('.avatar__initials');

    expect(initials.textContent.trim()).toBe('U');
  });

  it('should generate initials from a full name', () => {
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.detectChanges();

    expect(component.initials()).toBe('JD');
  });

  it('should generate initials from a single name', () => {
    fixture.componentRef.setInput('name', 'John');
    fixture.detectChanges();

    expect(component.initials()).toBe('J');
  });

  it('should support different sizes', () => {
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const avatar: HTMLElement = fixture.nativeElement.querySelector('.avatar');

    expect(avatar.classList).toContain('avatar--lg');
  });

  it('should support square shapes', () => {
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();

    const avatar: HTMLElement = fixture.nativeElement.querySelector('.avatar');

    expect(avatar.classList).toContain('avatar--square');
  });

  it('should display an image when a source is provided', () => {
    fixture.componentRef.setInput('name', 'John Doe');
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.detectChanges();

    const image: HTMLImageElement = fixture.nativeElement.querySelector('.avatar__image');

    expect(image).toBeTruthy();
    expect(image.alt).toBe('John Doe');
    expect(image.getAttribute('src')).toBe('https://example.com/avatar.jpg');
  });
});
