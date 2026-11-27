import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default page title', () => {
    expect(fixture.nativeElement.textContent).toContain('Dashboard');
  });

  it('should accept a custom page title', () => {
    fixture.componentRef.setInput('pageTitle', 'Meetings');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Meetings');
  });

  it('should display the user name', () => {
    expect(fixture.nativeElement.textContent).toContain('John Doe');
  });

  it('should not display the user role or dropdown arrow', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Member');
    expect(fixture.nativeElement.querySelector('.navbar__profile-arrow')).toBeNull();
  });

  it('should render the search bar by default', () => {
    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should hide the search bar when disabled', () => {
    fixture.componentRef.setInput('showSearch', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-search-bar')).toBeNull();
  });

  it('should emit when the menu button is clicked', () => {
    const spy = vi.fn();
    component.menuClicked.subscribe(spy);

    component.onMenuClick();

    expect(spy).toHaveBeenCalled();
  });

  it('should not render the removed notification button', () => {
    expect(fixture.nativeElement.querySelector('[aria-label="Notifications"]')).toBeNull();
  });

  it('should emit when the profile is clicked', () => {
    const spy = vi.fn();
    component.profileClicked.subscribe(spy);

    component.onProfileClick();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit search queries', () => {
    const spy = vi.fn();
    component.searchSubmitted.subscribe(spy);

    component.onSearch('Project planning');

    expect(spy).toHaveBeenCalledWith('Project planning');
  });
});
