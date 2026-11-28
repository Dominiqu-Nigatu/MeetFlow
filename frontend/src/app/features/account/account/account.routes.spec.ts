import { routes } from '../../../app.routes';
import { MainLayout } from '../../../layouts/main-layout/main-layout';
import { Account } from './account';

describe('Account route', () => {
  it('registers account inside the workspace layout', () => {
    expect(
      routes
        .find((route) => route.component === MainLayout)
        ?.children?.find((route) => route.path === 'account')?.component,
    ).toBe(Account);
  });
});
