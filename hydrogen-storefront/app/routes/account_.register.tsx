import {Form, Link, redirect, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/account_.register';
import {
  CUSTOMER_LOGIN_MUTATION,
  CUSTOMER_REGISTER_MUTATION,
} from '~/lib/graphql/customer';
import {getCustomerAccessToken, setCustomerSession} from '~/lib/customerAuth';
import {
  AuthShell,
  authInputClass,
  authButtonClass,
  authLinkClass,
} from '~/components/macorner/AuthShell';

export function meta() {
  return [
    {title: 'Create Account — Macorner'},
    {name: 'robots', content: 'noindex'},
  ];
}

export async function loader({context}: Route.LoaderArgs) {
  if (getCustomerAccessToken(context.session)) {
    throw redirect('/account');
  }
  return null;
}

export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const firstName = String(formData.get('firstName') || '').trim();
  const lastName = String(formData.get('lastName') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const result = await context.storefront.mutate(CUSTOMER_REGISTER_MUTATION, {
    variables: {
      input: {firstName, lastName, email, password},
    },
  });

  const userErrors = result.customerCreate?.customerUserErrors ?? [];
  if (result.errors?.length || userErrors.length || !result.customerCreate?.customer) {
    return {
      error: userErrors[0]?.message ?? 'Something went wrong. Please try again.',
    };
  }

  const loginResult = await context.storefront.mutate(CUSTOMER_LOGIN_MUTATION, {
    variables: {input: {email, password}},
  });

  const accessToken =
    loginResult.customerAccessTokenCreate?.customerAccessToken;

  if (!accessToken) {
    return redirect('/account/login');
  }

  setCustomerSession(context.session, accessToken, firstName);

  return redirect('/account');
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <AuthShell title="Create Account">
      <Form method="post" className="flex flex-col gap-4">
        <input
          type="text"
          name="firstName"
          required
          placeholder="First name"
          autoComplete="given-name"
          aria-label="First name"
          className={authInputClass}
        />
        <input
          type="text"
          name="lastName"
          required
          placeholder="Last name"
          autoComplete="family-name"
          aria-label="Last name"
          className={authInputClass}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          autoComplete="email"
          aria-label="Email"
          className={authInputClass}
        />
        <div className="flex flex-col gap-1.5">
          <input
            type="password"
            name="password"
            required
            minLength={5}
            maxLength={16}
            placeholder="Password"
            autoComplete="new-password"
            aria-label="Password"
            className={authInputClass}
          />
          <p className="text-[12px] text-[rgba(18,18,18,0.55)]">
            5 to 16 characters
          </p>
        </div>
        {actionData?.error && (
          <p className="text-[13px] text-red-600">{actionData.error}</p>
        )}
        <button type="submit" disabled={isSubmitting} className={authButtonClass}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </Form>
      <p className="mt-6 text-center text-[14px] tracking-[0.6px] text-[rgba(18,18,18,0.85)]">
        <Link to="/account/login" className={authLinkClass}>
          Login
        </Link>{' '}
        or{' '}
        <Link to="/" className={authLinkClass}>
          Return to store
        </Link>
      </p>
    </AuthShell>
  );
}
