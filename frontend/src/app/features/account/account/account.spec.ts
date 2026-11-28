import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Account, ACCOUNT_DELETED_KEY } from './account';

describe('Account', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [provideRouter([])],
    }).compileComponents();
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('requires explicit initiation and exact confirmation', async () => {
    const fixture = TestBed.createComponent(Account);
    const account = fixture.componentInstance;
    await account.deleteAccount();
    expect(localStorage.getItem(ACCOUNT_DELETED_KEY)).toBeNull();
    account.beginDeletion();
    account.confirmation.set('delete');
    await account.deleteAccount();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    expect(localStorage.getItem(ACCOUNT_DELETED_KEY)).toBeNull();
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });
  it('cancels without changing storage', () => {
    const account = TestBed.createComponent(Account).componentInstance;
    account.beginDeletion();
    account.confirmation.set('DELETE');
    account.cancelDeletion();
    expect(account.confirming()).toBe(false);
    expect(account.confirmation()).toBe('');
    expect(localStorage.getItem(ACCOUNT_DELETED_KEY)).toBeNull();
  });
  it('stores only a timestamp and preserves meetings, with duplicate submission guarded', async () => {
    const account = TestBed.createComponent(Account).componentInstance;
    localStorage.setItem('meetflow.meetings', 'keep me');
    let resolve!: (value: boolean) => void;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockReturnValue(new Promise<boolean>((done) => (resolve = done)));
    account.beginDeletion();
    account.confirmation.set('DELETE');
    const first = account.deleteAccount();
    await account.deleteAccount();
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['/login'], { state: { localAccountDeleted: true } });
    expect(new Date(localStorage.getItem(ACCOUNT_DELETED_KEY)!).toISOString()).toBe(
      account.deletedAt(),
    );
    expect(localStorage.getItem('meetflow.meetings')).toBe('keep me');
    resolve(true);
    await first;
    expect(account.deleting()).toBe(false);
  });
  it('reports storage failure without navigating or reporting deletion', async () => {
    const account = TestBed.createComponent(Account).componentInstance;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    account.beginDeletion();
    account.confirmation.set('DELETE');
    await account.deleteAccount();
    expect(account.deletedAt()).toBeNull();
    expect(account.errorMessage()).toContain('Nothing was changed');
    expect(account.deleting()).toBe(false);
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });
  it('honestly reports a navigation failure after deletion and allows retry', async () => {
    const account = TestBed.createComponent(Account).componentInstance;
    const navigate = vi
      .spyOn(TestBed.inject(Router), 'navigate')
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValue(true);
    account.beginDeletion();
    account.confirmation.set('DELETE');
    await account.deleteAccount();
    expect(account.deletedAt()).toBeTruthy();
    expect(account.errorMessage()).toContain('Local account marked deleted, but');
    await account.returnToLogin();
    expect(navigate).toHaveBeenCalledTimes(2);
  });
});
