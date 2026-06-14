import {Form, NavLink, Outlet, redirect} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_QUERY} from '~/lib/graphql/customer';
import {getCustomerAccessToken} from '~/lib/customerAuth';

export function meta() {
  return [
    {title: 'My Account — Macorner'},
    {name: 'description', content: 'Manage your Macorner account, orders, and addresses.'},
    {name: 'robots', content: 'noindex'},
  ];
}

export async function loader({request, context}: Route.LoaderArgs) {
  const customerAccessToken = getCustomerAccessToken(context.session);

  if (!customerAccessToken) {
    const returnTo = new URL(request.url).pathname;
    throw redirect(`/account/login?return_to=${returnTo}`);
  }

  const result = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {customerAccessToken},
  });

  if (result.errors?.length || !result.customer) {
    throw redirect('/account/login');
  }

  return {customer: result.customer};
}

export default function AccountLayout({loaderData}: Route.ComponentProps) {
  const {customer} = loaderData;
  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : 'Welcome to your account'
    : 'Account Details';

  const navLinkClass = ({isActive}: {isActive: boolean}) =>
    [
      'px-4 py-2 rounded-[8px] text-[15px] font-medium tracking-[0.6px] transition-colors',
      isActive
        ? 'bg-[#FC6514] text-white'
        : 'text-[rgb(18,18,18)] hover:text-[#FC6514]',
    ].join(' ');

  return (
    <div
      style={{fontFamily: 'Poppins, sans-serif'}}
      className="max-w-[1100px] mx-auto px-[18px] py-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-[28px] font-semibold tracking-[0.6px] text-[rgb(18,18,18)] m-0">
          {heading}
        </h1>
        <Form method="POST" action="/account/logout">
          <button
            type="submit"
            className="text-[14px] font-medium tracking-[0.6px] text-[rgba(18,18,18,0.6)] hover:text-[#FC6514] transition-colors"
          >
            Sign out
          </button>
        </Form>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-[var(--color-header-border)] pb-5 mb-8">
        <NavLink to="/account/orders" className={navLinkClass}>
          Orders
        </NavLink>
        <NavLink to="/account/addresses" className={navLinkClass}>
          Addresses
        </NavLink>
        <NavLink to="/account/profile" className={navLinkClass}>
          Profile
        </NavLink>
      </nav>

      <Outlet context={{customer}} />
    </div>
  );
}
