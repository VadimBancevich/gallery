import { memo, FC } from 'react';
import { RoutePath } from 'routes';
import {
  Header as LayoutHeader,
  Container,
  Group,
} from '@mantine/core';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import { accountApi } from 'resources/account';

import UserMenu from './components/UserMenu';
import ShadowLoginBanner from './components/ShadowLoginBanner';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  return (
    <LayoutHeader height="72px">
      {account?.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        sx={(theme) => ({
          minHeight: '72px',
          padding: '0 32px',
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.white,
          borderBottom: `1px solid ${theme.colors.gray[4]}`,
        })}
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <LogoImage />
        </Link>
        <Group>
          <Link type='router' href={RoutePath.MyCollection}>My Collection</Link>
          {account ?<UserMenu /> : <Link type='router' href={RoutePath.SignIn}>Sign In</Link>}
        </Group>
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
