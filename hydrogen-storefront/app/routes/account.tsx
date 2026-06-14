import {Form, NavLink, Outlet} from 'react-router';
import type {Route} from './+types/account';

export function meta() {
  return [
    {title: 'My Account — Macorner'},
    {name: 'description', content: 'Manage your Macorner account, orders, and addresses.'},
    {name: 'robots', content: 'noindex'},
  ];
}
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/customer';

export async function loader({context}: Route.LoaderArgs) {
  // customerAccount.query auto-redirects to login when unauthenticated.
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return {customer: data.customer};
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
        ? 'bg-[#1e4e79] text-white'
        : 'text-[rgb(18,18,18)] hover:text-[#1e4e79]',
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
            className="text-[14px] font-medium tracking-[0.6px] text-[rgba(18,18,18,0.6)] hover:text-[#1e4e79] transition-colors"
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
