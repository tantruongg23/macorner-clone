import {redirect, useFetcher} from 'react-router';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/account.orders.$id';
import {CUSTOMER_ORDER_QUERY} from '~/lib/graphql/customer';

export function meta({data}: Route.MetaArgs) {
  const orderName = data?.order?.name ?? 'Order';
  return [
    {title: `${orderName} — Macorner`},
    {name: 'description', content: `View details for ${orderName}.`},
    {name: 'robots', content: 'noindex'},
  ];
}

export async function loader({params, context}: Route.LoaderArgs) {
  const orderId = atob(params.id ?? '');
  if (!orderId) throw new Response('Not found', {status: 404});

  const result = await context.storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {id: orderId},
  });

  if (result.errors?.length || !result.order) {
    throw new Response('Order not found', {status: 404});
  }

  return {order: result.order};
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'reorder') {
    const linesJson = formData.get('lines') as string;
    const lines = JSON.parse(linesJson ?? '[]') as Array<{
      merchandiseId: string;
      quantity: number;
    }>;

    const validLines = lines.filter((l) => l.merchandiseId);
    if (validLines.length > 0) {
      await context.cart.addLines(validLines);
    }
    return redirect('/cart');
  }

  return null;
}

function StatusBadge({status}: {status: string}) {
  const color =
    status === 'PAID' || status === 'SUCCESS' || status === 'FULFILLED'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'PENDING' || status === 'IN_PROGRESS' || status === 'PARTIAL'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-gray-100 text-[rgba(18,18,18,0.6)]';

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[12px] font-medium capitalize ${color}`}
    >
      {status.toLowerCase().replace(/_/g, ' ')}
    </span>
  );
}

export default function OrderDetail({loaderData}: Route.ComponentProps) {
  const {order} = loaderData;
  const reorderFetcher = useFetcher<typeof action>();

  const lineItems = order.lineItems?.nodes ?? [];
  const tracking = order.successfulFulfillments?.[0]?.trackingInfo?.[0];

  const reorderLines = lineItems
    .filter((l) => l.variant?.id)
    .map((l) => ({merchandiseId: l.variant!.id, quantity: l.quantity}));

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="max-w-[760px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-[20px] font-semibold tracking-[0.4px] text-[rgb(18,18,18)] m-0 mb-1">
            Order {order.name}
          </h2>
          <p className="text-[13px] text-[rgba(18,18,18,0.55)] m-0">
            Placed {fmtDate(order.processedAt)}
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          {order.financialStatus && (
            <StatusBadge status={order.financialStatus} />
          )}
          {order.fulfillmentStatus && (
            <StatusBadge status={order.fulfillmentStatus} />
          )}
          {reorderLines.length > 0 && (
            <reorderFetcher.Form method="post">
              <input type="hidden" name="intent" value="reorder" />
              <input
                type="hidden"
                name="lines"
                value={JSON.stringify(reorderLines)}
              />
              <button
                type="submit"
                disabled={reorderFetcher.state !== 'idle'}
                className="px-5 py-2 rounded-[8px] bg-[#f7921f] text-white text-[13px] font-semibold tracking-[0.5px] hover:bg-[#e0830e] transition-colors disabled:opacity-60"
              >
                {reorderFetcher.state !== 'idle' ? 'Adding…' : 'Re-order'}
              </button>
            </reorderFetcher.Form>
          )}
        </div>
      </div>

      {/* Tracking */}
      {tracking && (
        <div className="mb-6 p-4 rounded-[10px] bg-blue-50 border border-blue-100">
          <p className="text-[13px] text-[rgb(18,18,18)] m-0">
            <span className="font-medium">Tracking:</span>{' '}
            {tracking.url ? (
              <a
                href={tracking.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#f7921f] hover:underline font-medium"
              >
                {tracking.number ?? 'View tracking'}
              </a>
            ) : (
              <span>{tracking.number}</span>
            )}
          </p>
        </div>
      )}

      {/* Line items */}
      <div className="border border-[var(--color-header-border)] rounded-[12px] overflow-hidden mb-6">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[rgb(243,243,243)] text-[rgba(18,18,18,0.55)]">
              <th className="text-left px-4 py-3 font-medium">Item</th>
              <th className="text-center px-3 py-3 font-medium">Qty</th>
              <th className="text-right px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((line, index) => (
              <tr
                key={index}
                className="border-t border-[var(--color-header-border)]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    {line.variant?.image?.url && (
                      <img
                        src={line.variant.image.url}
                        alt={line.variant.image.altText ?? line.title}
                        width={56}
                        height={56}
                        className="rounded-[8px] object-cover flex-shrink-0 bg-[rgb(243,243,243)]"
                        style={{width: 56, height: 56}}
                      />
                    )}
                    <div>
                      {line.variant?.product?.handle ? (
                        <Link
                          to={`/products/${line.variant.product.handle}`}
                          className="text-[rgb(18,18,18)] font-medium hover:text-[#f7921f] transition-colors"
                        >
                          {line.title}
                        </Link>
                      ) : (
                        <span className="text-[rgb(18,18,18)] font-medium">
                          {line.title}
                        </span>
                      )}
                      {line.variant?.title && line.variant.title !== 'Default Title' && (
                        <p className="text-[12px] text-[rgba(18,18,18,0.5)] m-0 mt-0.5">
                          {line.variant.title}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 text-center text-[rgba(18,18,18,0.7)]">
                  {line.quantity}
                </td>
                <td className="px-4 py-4 text-right text-[rgba(18,18,18,0.8)]">
                  <Money data={line.discountedTotalPrice} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals + shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Shipping address */}
        {order.shippingAddress && (
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.8px] font-medium text-[rgba(18,18,18,0.5)] mb-3 m-0">
              Ship to
            </h3>
            <p className="text-[14px] text-[rgb(18,18,18)] leading-6 m-0">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.address1}
              {order.shippingAddress.address2 && (
                <>
                  <br />
                  {order.shippingAddress.address2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
              {order.shippingAddress.zip}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>
        )}

        {/* Price summary */}
        <div className="sm:text-right">
          <h3 className="text-[13px] uppercase tracking-[0.8px] font-medium text-[rgba(18,18,18,0.5)] mb-3 m-0">
            Summary
          </h3>
          <div className="space-y-1.5">
            {order.subtotalPrice && (
              <div className="flex sm:justify-end gap-8 text-[14px] text-[rgba(18,18,18,0.7)]">
                <span className="w-20 sm:w-auto">Subtotal</span>
                <Money data={order.subtotalPrice} />
              </div>
            )}
            {order.totalTax && (
              <div className="flex sm:justify-end gap-8 text-[14px] text-[rgba(18,18,18,0.7)]">
                <span className="w-20 sm:w-auto">Tax</span>
                <Money data={order.totalTax} />
              </div>
            )}
            <div className="flex sm:justify-end gap-8 text-[15px] font-semibold text-[rgb(18,18,18)] pt-1.5 border-t border-[var(--color-header-border)]">
              <span className="w-20 sm:w-auto">Total</span>
              <Money data={order.currentTotalPrice} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/account/orders"
          className="text-[13px] font-medium text-[rgba(18,18,18,0.55)] hover:text-[#f7921f] transition-colors"
        >
          ← Back to orders
        </Link>
      </div>
    </div>
  );
}
