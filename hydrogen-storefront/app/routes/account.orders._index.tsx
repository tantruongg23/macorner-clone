import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/account.orders._index';

export function meta() {
  return [
    {title: 'My Orders — Harpera'},
    {name: 'description', content: 'View your Harpera order history.'},
    {name: 'robots', content: 'noindex'},
  ];
}
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/customer';

export async function loader({context}: Route.LoaderArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {variables: {first: 20}},
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Orders not found');
  }

  return {orders: data.customer.orders};
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
          prefetch="intent"
          className="inline-block px-7 py-3 rounded-[10px] bg-[#1e4e79] text-white text-[15px] font-semibold tracking-[0.6px] hover:bg-[#122e49] transition-colors"
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
                  prefetch="intent"
                  className="hover:text-[#1e4e79] transition-colors"
                >
                  #{order.number}
                </Link>
              </td>
              <td className="py-4 pr-4 text-[rgba(18,18,18,0.7)]">
                {new Date(order.processedAt).toLocaleDateString()}
              </td>
              <td className="py-4 pr-4 capitalize text-[rgba(18,18,18,0.7)]">
                {order.financialStatus?.toLowerCase() ?? '—'}
              </td>
              <td className="py-4 pr-4 capitalize text-[rgba(18,18,18,0.7)]">
                {order.fulfillments?.nodes?.[0]?.status?.toLowerCase() ?? '—'}
              </td>
              <td className="py-4 pr-4 font-medium">
                <Money data={order.totalPrice} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
