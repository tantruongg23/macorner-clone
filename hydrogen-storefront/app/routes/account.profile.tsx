import {useOutletContext} from 'react-router';
import type {CustomerDetailsQuery} from 'storefrontapi.generated';

type Customer = CustomerDetailsQuery['customer'];

export default function Profile() {
  const {customer} = useOutletContext<{customer: Customer}>();
  const address = customer?.defaultAddress;

  const Field = ({label, value}: {label: string; value?: string | null}) => (
    <div className="py-3 border-b border-[var(--color-header-border)]">
      <p className="text-[12px] uppercase tracking-[1px] text-[rgba(18,18,18,0.45)] m-0 mb-1">
        {label}
      </p>
      <p className="text-[15px] text-[rgb(18,18,18)] m-0">{value || '—'}</p>
    </div>
  );

  return (
    <div className="max-w-[560px]">
      <Field label="First name" value={customer?.firstName} />
      <Field label="Last name" value={customer?.lastName} />
      <Field label="Email" value={customer?.email} />
      <Field label="Phone" value={customer?.phone ?? address?.phone} />
      <Field
        label="Default address"
        value={address?.formatted ? address.formatted.join(', ') : null}
      />
    </div>
  );
}
