import { TestBed } from '@angular/core/testing';
import { MeetingDetail } from './meeting-detail';

describe('MeetingDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDetail],
    }).compileComponents();
  });

  it('should create the meeting detail component', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialise the meeting title', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.meetingTitle()).toBe(
      'Product Strategy Meeting',
    );
  });

  it('should initialise the meeting status', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.meetingStatus()).toBe('completed');
  });

  it('should initialise the summary tab', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.activeTab()).toBe('summary');
  });

  it('should initialise four action items', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.actionItems().length).toBe(4);
  });

  it('should initialise one completed action item', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.completedActionCount()).toBe(1);
  });

  it('should initialise three remaining action items', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.remainingActionCount()).toBe(3);
  });

  it('should calculate the progress percentage', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    expect(fixture.componentInstance.progressPercentage()).toBe(25);
  });

  it('should switch to the transcript tab', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onTabChange('transcript');

    expect(fixture.componentInstance.activeTab()).toBe('transcript');
  });

  it('should switch back to the summary tab', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onTabChange('transcript');
    fixture.componentInstance.onTabChange('summary');

    expect(fixture.componentInstance.activeTab()).toBe('summary');
  });

  it('should mark an action item as completed', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    expect(
      fixture.componentInstance.actionItems().find(item => item.id === '1')?.completed,
    ).toBe(true);
  });

  it('should mark an action item as incomplete', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onActionItemCompleted({
      id: '3',
      completed: false,
    });

    expect(
      fixture.componentInstance.actionItems().find(item => item.id === '3')?.completed,
    ).toBe(false);
  });

  it('should update completed action count when a task is completed', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    expect(fixture.componentInstance.completedActionCount()).toBe(2);
  });

  it('should update remaining action count when a task is completed', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    expect(fixture.componentInstance.remainingActionCount()).toBe(2);
  });

  it('should update the progress percentage when a task is completed', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onActionItemCompleted({
      id: '1',
      completed: true,
    });

    expect(fixture.componentInstance.progressPercentage()).toBe(50);
  });

  it('should render the meeting title', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Product Strategy Meeting',
    );
  });

  it('should render the summary tab', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Meeting summary');
  });

  it('should render the key discussion points', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Key discussion points',
    );
  });

  it('should render the key decisions', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Key decisions');
  });

  it('should render the action items', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Action items');
  });

  it('should render the transcript tab button', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Transcript');
  });

  it('should render the export button', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Export summary');
  });

  it('should render the back button', () => {
    const fixture = TestBed.createComponent(MeetingDetail);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Back to meetings');
  });

  it('should display the transcript when the transcript tab is selected', () => {
    const fixture = TestBed.createComponent(MeetingDetail);

    fixture.componentInstance.onTabChange('transcript');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Meeting transcript');
    expect(fixture.nativeElement.textContent).toContain('Welcome everyone');
  });
});