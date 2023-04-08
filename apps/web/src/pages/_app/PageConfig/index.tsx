import { FC, Fragment, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';

import { routesConfiguration, ScopeType, LayoutType, RoutePath } from 'routes';
import { accountApi } from 'resources/account';

import { analyticsService } from 'services';

import 'resources/user/user.handlers';
import 'resources/picture/picture.handlers';

import environmentConfig from 'config';
import MainLayout from './MainLayout';
import UnauthorizedLayout from './UnauthorizedLayout';
import PrivateScope from './PrivateScope';
import { Center, Loader } from '@mantine/core';

const layoutToComponent = {
  [LayoutType.MAIN]: MainLayout,
  [LayoutType.UNAUTHORIZED]: UnauthorizedLayout,
};

const scopeToComponent = {
  [ScopeType.PUBLIC]: Fragment,
  [ScopeType.PRIVATE]: PrivateScope,
};

interface PageConfigProps {
  children: ReactElement;
}

const PageConfig: FC<PageConfigProps> = ({ children }) => {
  const { route, replace } = useRouter();
  const { data: account, isLoading: isAccountLoading } = accountApi.useGet({
    onSettled: () => {
      if (!environmentConfig?.mixpanel?.apiKey) return null;

      analyticsService.init();

      analyticsService.setUser(account);
    }
  });

  useEffect(() => {
    if (account && !isAccountLoading && (route === RoutePath.SignIn || route === RoutePath.SignUp)) {
      replace(RoutePath.Home);
    }
  }, [account]);

  const { scope, layout } = routesConfiguration[route as RoutePath] || {};

  const Scope = account ? PrivateScope : Fragment;
  const Layout = layout ? layoutToComponent[layout] : Fragment;

  if (scope === ScopeType.PRIVATE) {
    if (isAccountLoading) {
      return <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    } else if (!account) {
      replace(RoutePath.SignIn);
      return null;
    }
  }

  return (
    <Scope>
      <Layout>
        {children}
      </Layout>
    </Scope>
  );
};

export default PageConfig;
