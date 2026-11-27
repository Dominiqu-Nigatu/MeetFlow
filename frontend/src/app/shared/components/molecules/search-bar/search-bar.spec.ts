
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the input atom', () => {
    expect(fixture.nativeElement.querySelector('app-input')).toBeTruthy();
  });

  it('should render the button atom', () => {
    expect(fixture.nativeElement.querySelector('app-button')).toBeTruthy();
  });

  it('should display the default placeholder', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Search...');
  });

  it('should support a custom placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Search meetings');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Search meetings');
  });

  it('should update the query when the input changes', () => {
    component.onValueChange('Project meeting');

    expect(component.query()).toBe('Project meeting');
  });

  it('should emit the search query on submission', () => {
    const emitSpy = vi.spyOn(component.search, 'emit');

    component.onValueChange('Project meeting');

    const event = new Event('submit', { cancelable: true });
    fixture.nativeElement.querySelector('form').dispatchEvent(event);

    expect(emitSpy).toHaveBeenCalledWith('Project meeting');
  });

  it('should trim whitespace before searching', () => {
    const emitSpy = vi.spyOn(component.search, 'emit');

    component.onValueChange('  Project meeting  ');
    component.onSubmit(new Event('submit'));

    expect(emitSpy).toHaveBeenCalledWith('Project meeting');
  });

  it('should not emit an empty search', () => {
    const emitSpy = vi.spyOn(component.search, 'emit');

    component.onSubmit(new Event('submit'));

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should support a disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
