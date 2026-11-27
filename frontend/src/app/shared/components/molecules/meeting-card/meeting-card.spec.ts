import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingCard } from './meeting-card';

describe('MeetingCard', () => {
  let component: MeetingCard;
  let fixture: ComponentFixture<MeetingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingCard);
    fixture.componentRef.setInput('title', 'Project Planning');
    fixture.componentRef.setInput('date', '24 November 2026');
    fixture.componentRef.setInput('duration', '45 minutes');
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the meeting title', () => {
    expect(fixture.nativeElement.textContent).toContain('Project Planning');
  });

  it('should display the meeting date', () => {
    expect(fixture.nativeElement.textContent).toContain('24 November 2026');
  });

  it('should display the meeting duration', () => {
    expect(fixture.nativeElement.textContent).toContain('45 minutes');
  });

  it('should default to pending status', () => {
    expect(component.summaryStatus()).toBe('pending');
  });

  it('should display the action item count', () => {
    fixture.componentRef.setInput('actionItemCount', 3);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('3 action items');
  });

  it('should emit selected when clicked', () => {
    const spy = vi.fn();
    component.selected.subscribe(spy);

    fixture.nativeElement.querySelector('.meeting-card').click();

    expect(spy).toHaveBeenCalled();
  });

  it('should display completed status', () => {
    fixture.componentRef.setInput('summaryStatus', 'completed');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('completed');
  });

  it('should display processing status', () => {
    fixture.componentRef.setInput('summaryStatus', 'processing');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('processing');
  });
  it('should not display decorative metadata icons', () => {
    expect(fixture.nativeElement.querySelector('.meeting-card__icon')).toBeNull();
  });
});
