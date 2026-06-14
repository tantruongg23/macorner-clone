import {Link, redirect} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/account.orders._index';
import {CUSTOMER_ORDERS_QUERY} from '~/lib/graphql/customer';
import {getCustomerAccessToken} from '~/lib/customerAuth';

export function meta() {
  return [
    {title: 'My Orders — Macorner'},
    {name: 'description', content: 'View your Macorner order history.'},
    {name: 'robots', content: 'noindex'},
  ];
}

export async function loader({context}: Route.LoaderArgs) {
  const customerAccessToken = getCustomerAccessToken(context.session);
  if (!customerAccessToken) {
    throw redirect('/account/login?return_to=/account/orders');
  }

  const result = await context.storefront.query(CUSTOMER_ORDERS_QUERY, {
    variables: {customerAccessToken, first: 20},
  });

  if (result.errors?.length || !result.customer) {
    throw new Error('Orders not found');
  }

  return {orders: result.customer.orders};
}

export default function Orders({loaderData}: Route.ComponentProps) {
  const {orders} = loaderData;
  const nodes = orders?.nodes ?? [];

  if (nodes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[16px] text-[rgba(18,18,18,0.6)] mb-6">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          to="/collections/all"
          className="inline-block px-7 py-3 rounded-[10px] bg-[#FC6514] text-white text-[15px] font-semibold tracking-[0.6px] hover:bg-[#e85a10] transition-colors"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="text-left text-[rgba(18,18,18,0.55)] border-b border-[var(--color-header-border)]">
            <th className="py-3 pr-4 font-medium">Order</th>
            <th className="py-3 pr-4 font-medium">Date</th>
            <th className="py-3 pr-4 font-medium">Payment</th>
            <th className="py-3 pr-4 font-medium">Fulfillment</th>
            <th className="py-3 pr-4 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((order) => (
            <tr key={order.id} className="border-b border-[var(--color-header-border)]">
              <td className="py-4 pr-4 font-semibold text-[rgb(18,18,18)]">
                <Link
                  to={`/account/orders/${btoa(order.id)}`}
                  className="hover:text-[#FC6514] transition-colors"
                >
                  #{order.orderNumber}
                </Link>
              </td>
              <td className="py-4 pr-4 text-[rgba(18,18,18,0.7)]">
                {new Date(order.processedAt).toLocaleDateString()}
              </td>
              <td className="py-4 pr-4 capitalize text-[rgba(18,18,18,0.7)]">
                {order.financialStatus?.toLowerCase() ?? '—'}
              </td>
              <td className="py-4 pr-4 capitalize text-[rgba(18,18,18,0.7)]">
                {order.fulfillmentStatus?.toLowerCase().replace(/_/g, ' ') ?? '—'}
              </td>
              <td className="py-4 pr-4 font-medium">
                <Money data={order.currentTotalPrice} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
