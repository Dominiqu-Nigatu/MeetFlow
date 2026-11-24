
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('title', 'Confirm action');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(fixture.nativeElement.querySelector('[role="dialog"]'))
      .toBeFalsy();
  });

  it('should display when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="dialog"]'))
      .toBeTruthy();
  });

  it('should display its title', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent)
      .toContain('Confirm action');
  });

  it('should support small size', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.modal--sm')
    ).toBeTruthy();
  });

  it('should support medium size', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'md');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.modal--md')
    ).toBeTruthy();
  });

  it('should support large size', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.modal--lg')
    ).toBeTruthy();
  });

  it('should have dialog accessibility attributes', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');

    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Confirm action');
  });

  it('should emit closed when close is called', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');

    component.close();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should close when the backdrop is clicked', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = {
      target: 'backdrop',
      currentTarget: 'backdrop',
    } as unknown as MouseEvent;

    component.onBackdropClick(event);

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not close when backdrop closing is disabled', () => {
    fixture.componentRef.setInput('closeOnBackdrop', false);

    const emitSpy = vi.spyOn(component.closed, 'emit');

    const event = {
      target: 'backdrop',
      currentTarget: 'backdrop',
    } as unknown as MouseEvent;

    component.onBackdropClick(event);

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
