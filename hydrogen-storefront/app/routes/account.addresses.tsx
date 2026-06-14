import {useState} from 'react';
import {useFetcher} from 'react-router';
import type {Route} from './+types/account.addresses';

export function meta() {
  return [
    {title: 'My Addresses — Macorner'},
    {name: 'description', content: 'Manage your saved shipping addresses.'},
    {name: 'robots', content: 'noindex'},
  ];
}
import {
  CUSTOMER_DETAILS_QUERY,
  CREATE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  SET_DEFAULT_ADDRESS_MUTATION,
} from '~/graphql/customer-account/customer';
import type {CustomerDetailsQuery} from 'customer-accountapi.generated';

type Address = NonNullable<
  CustomerDetailsQuery['customer']['addresses']['nodes'][0]
>;

export async function loader({context}: Route.LoaderArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );
  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }
  return {
    addresses: data.customer.addresses.nodes,
    defaultAddressId: data.customer.defaultAddress?.id ?? null,
  };
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  if (intent === 'delete') {
    const addressId = formData.get('addressId') as string;
    const {errors} = await context.customerAccount.mutate(
      DELETE_ADDRESS_MUTATION,
      {variables: {addressId}},
    );
    if (errors?.length) return {error: errors[0].message};
    return {success: true};
  }

  if (intent === 'setDefault') {
    const addressId = formData.get('addressId') as string;
    const {errors} = await context.customerAccount.mutate(
      SET_DEFAULT_ADDRESS_MUTATION,
      {variables: {addressId}},
    );
    if (errors?.length) return {error: errors[0].message};
    return {success: true};
  }

  const address = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    company: (formData.get('company') as string) || undefined,
    address1: formData.get('address1') as string,
    address2: (formData.get('address2') as string) || undefined,
    city: formData.get('city') as string,
    zoneCode: formData.get('zoneCode') as string,
    territoryCode: formData.get('territoryCode') as string,
    zip: formData.get('zip') as string,
    phoneNumber: (formData.get('phoneNumber') as string) || undefined,
  };

  if (intent === 'create') {
    const {data, errors} = await context.customerAccount.mutate(
      CREATE_ADDRESS_MUTATION,
      {variables: {address}},
    );
    const userErrors = (data as any)?.customerAddressCreate?.userErrors ?? [];
    if (errors?.length || userErrors.length) {
      return {error: errors?.[0]?.message ?? userErrors[0]?.message};
    }
    return {success: true};
  }

  if (intent === 'update') {
    const addressId = formData.get('addressId') as string;
    const {data, errors} = await context.customerAccount.mutate(
      UPDATE_ADDRESS_MUTATION,
      {variables: {addressId, address}},
    );
    const userErrors = (data as any)?.customerAddressUpdate?.userErrors ?? [];
    if (errors?.length || userErrors.length) {
      return {error: errors?.[0]?.message ?? userErrors[0]?.message};
    }
    return {success: true};
  }

  return null;
}

const inputClass =
  'w-full border border-[var(--color-header-border)] rounded-[8px] px-3 py-2 text-[14px] text-[rgb(18,18,18)] focus:outline-none focus:border-[#f7921f] transition-colors';
const labelClass =
  'block text-[12px] uppercase tracking-[0.8px] text-[rgba(18,18,18,0.5)] mb-1';

function AddressForm({
  address,
  intent,
  onCancel,
}: {
  address?: Address;
  intent: 'create' | 'update';
  onCancel: () => void;
}) {
  const fetcher = useFetcher<typeof action>();
  const isSubmitting = fetcher.state !== 'idle';
  const result = fetcher.data as {error?: string; success?: boolean} | null;

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value={intent} />
      {address && (
        <input type="hidden" name="addressId" value={address.id} />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First name *</label>
          <input
            className={inputClass}
            name="firstName"
            defaultValue={address?.firstName ?? ''}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Last name *</label>
          <input
            className={inputClass}
            name="lastName"
            defaultValue={address?.lastName ?? ''}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Company</label>
          <input
            className={inputClass}
            name="company"
            defaultValue={address?.company ?? ''}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Address *</label>
          <input
            className={inputClass}
            name="address1"
            defaultValue={address?.address1 ?? ''}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Apt, suite, etc.</label>
          <input
            className={inputClass}
            name="address2"
            defaultValue={address?.address2 ?? ''}
          />
        </div>
        <div>
          <label className={labelClass}>City *</label>
          <input
            className={inputClass}
            name="city"
            defaultValue={address?.city ?? ''}
            required
          />
        </div>
        <div>
          <label className={labelClass}>State / Province *</label>
          <input
            className={inputClass}
            name="zoneCode"
            defaultValue={address?.zoneCode ?? ''}
            required
            placeholder="e.g. CA"
          />
        </div>
        <div>
          <label className={labelClass}>ZIP / Postal code *</label>
          <input
            className={inputClass}
            name="zip"
            defaultValue={address?.zip ?? ''}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Country code *</label>
          <input
            className={inputClass}
            name="territoryCode"
            defaultValue={address?.territoryCode ?? 'US'}
            required
            placeholder="US"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Phone</label>
          <input
            className={inputClass}
            name="phoneNumber"
            defaultValue={address?.phoneNumber ?? ''}
            type="tel"
          />
        </div>
      </div>

      {result?.error && (
        <p className="mt-3 text-[13px] text-red-600">{result.error}</p>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-[8px] bg-[#f7921f] text-white text-[14px] font-semibold tracking-[0.5px] hover:bg-[#e0830e] transition-colors disabled:opacity-60"
        >
          {isSubmitting
            ? 'Saving…'
            : intent === 'create'
            ? 'Add address'
            : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-[8px] border border-[var(--color-header-border)] text-[14px] font-medium text-[rgba(18,18,18,0.7)] hover:border-[#f7921f] transition-colors"
        >
          Cancel
        </button>
      </div>
    </fetcher.Form>
  );
}

function AddressCard({
  address,
  isDefault,
  onEdit,
}: {
  address: Address;
  isDefault: boolean;
  onEdit: () => void;
}) {
  const deleteFetcher = useFetcher<typeof action>();
  const defaultFetcher = useFetcher<typeof action>();

  return (
    <div
      className={`border rounded-[12px] p-5 relative ${
        isDefault
          ? 'border-[#f7921f] bg-orange-50/40'
          : 'border-[var(--color-header-border)]'
      }`}
    >
      {isDefault && (
        <span className="absolute top-4 right-4 text-[11px] font-semibold text-[#f7921f] uppercase tracking-[0.8px]">
          Default
        </span>
      )}
      <p className="text-[14px] text-[rgb(18,18,18)] leading-6 m-0">
        {address.firstName} {address.lastName}
        {address.company && (
          <>
            <br />
            {address.company}
          </>
        )}
        <br />
        {address.address1}
        {address.address2 && (
          <>
            <br />
            {address.address2}
          </>
        )}
        <br />
        {address.city}, {address.zoneCode} {address.zip}
        <br />
        {address.territoryCode}
        {address.phoneNumber && (
          <>
            <br />
            {address.phoneNumber}
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={onEdit}
          className="text-[13px] font-medium text-[#f7921f] hover:underline"
        >
          Edit
        </button>

        {!isDefault && (
          <defaultFetcher.Form method="post">
            <input type="hidden" name="intent" value="setDefault" />
            <input type="hidden" name="addressId" value={address.id} />
            <button
              type="submit"
              disabled={defaultFetcher.state !== 'idle'}
              className="text-[13px] font-medium text-[rgba(18,18,18,0.6)] hover:text-[#f7921f] transition-colors disabled:opacity-50"
            >
              Set as default
            </button>
          </defaultFetcher.Form>
        )}

        <deleteFetcher.Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="addressId" value={address.id} />
          <button
            type="submit"
            disabled={deleteFetcher.state !== 'idle'}
            onClick={(e) => {
              if (!confirm('Remove this address?')) e.preventDefault();
            }}
            className="text-[13px] font-medium text-[rgba(18,18,18,0.45)] hover:text-red-600 transition-colors disabled:opacity-50"
          >
            Remove
          </button>
        </deleteFetcher.Form>
      </div>
    </div>
  );
}

export default function Addresses({loaderData}: Route.ComponentProps) {
  const {addresses, defaultAddressId} = loaderData;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="max-w-[700px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-semibold tracking-[0.4px] text-[rgb(18,18,18)] m-0">
          Addresses
        </h2>
        {!showAdd && !editingId && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-5 py-2 rounded-[8px] border border-[#f7921f] text-[#f7921f] text-[13px] font-semibold tracking-[0.5px] hover:bg-[#f7921f] hover:text-white transition-colors"
          >
            + Add new address
          </button>
        )}
      </div>

      {showAdd && (
        <div className="border border-[var(--color-header-border)] rounded-[12px] p-5 mb-6">
          <h3 className="text-[16px] font-semibold text-[rgb(18,18,18)] mb-4 m-0">
            New address
          </h3>
          <AddressForm
            intent="create"
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      {addresses.length === 0 && !showAdd ? (
        <p className="text-[15px] text-[rgba(18,18,18,0.55)]">
          No saved addresses yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <div
                key={addr.id}
                className="border border-[#f7921f] rounded-[12px] p-5"
              >
                <h3 className="text-[16px] font-semibold text-[rgb(18,18,18)] mb-4 m-0">
                  Edit address
                </h3>
                <AddressForm
                  intent="update"
                  address={addr}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                isDefault={addr.id === defaultAddressId}
                onEdit={() => setEditingId(addr.id)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
