import {useState} from 'react';
import {Form, Link, redirect, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/account_.login';
import {
  CUSTOMER_LOGIN_MUTATION,
  CUSTOMER_RECOVER_MUTATION,
} from '~/lib/graphql/customer';
import {getCustomerAccessToken, setCustomerSession} from '~/lib/customerAuth';
import {
  AuthShell,
  authInputClass,
  authButtonClass,
  authLinkClass,
  authTextButtonClass,
} from '~/components/macorner/AuthShell';

export function meta() {
  return [
    {title: 'Login — Macorner'},
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
  const intent = formData.get('intent');

  if (intent === 'recover') {
    const email = String(formData.get('email') || '').trim();
    const result = await context.storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });
    const userErrors = result.customerRecover?.customerUserErrors ?? [];
    if (result.errors?.length || userErrors.length) {
      return {
        intent: 'recover' as const,
        error: userErrors[0]?.message ?? 'Something went wrong. Please try again.',
      };
    }
    return {intent: 'recover' as const, success: true};
  }

  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const result = await context.storefront.mutate(CUSTOMER_LOGIN_MUTATION, {
    variables: {input: {email, password}},
  });

  const userErrors = result.customerAccessTokenCreate?.customerUserErrors ?? [];
  const accessToken = result.customerAccessTokenCreate?.customerAccessToken;

  if (result.errors?.length || userErrors.length || !accessToken) {
    return {
      intent: 'login' as const,
      error: userErrors[0]?.message ?? 'Incorrect email or password.',
    };
  }

  setCustomerSession(context.session, accessToken);

  const returnTo = new URL(request.url).searchParams.get('return_to');
  return redirect(returnTo?.startsWith('/') ? returnTo : '/account');
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const [showRecover, setShowRecover] = useState(false);

  if (showRecover || actionData?.intent === 'recover') {
    const recoverData =
      actionData?.intent === 'recover' ? actionData : undefined;

    return (
      <AuthShell title="Reset your password">
        {recoverData?.success ? (
          <p className="text-center text-[15px] text-[rgba(18,18,18,0.85)]">
            We&apos;ve sent you an email with a link to reset your password.
          </p>
        ) : (
          <Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="intent" value="recover" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              autoComplete="email"
              className={authInputClass}
            />
            {recoverData?.error && (
              <p className="text-[13px] text-red-600">{recoverData.error}</p>
            )}
            <button type="submit" disabled={isSubmitting} className={authButtonClass}>
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </Form>
        )}
        <p className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowRecover(false)}
            className={authTextButtonClass}
          >
            Cancel
          </button>
        </p>
      </AuthShell>
    );
  }

  const loginError =
    actionData?.intent === 'login' ? actionData.error : undefined;

  return (
    <AuthShell title="Customer Login">
      <Form method="post" className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          autoComplete="email"
          aria-label="Email"
          className={authInputClass}
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          autoComplete="current-password"
          aria-label="Password"
          className={authInputClass}
        />
        <button
          type="button"
          onClick={() => setShowRecover(true)}
          className={`${authTextButtonClass} self-start -mt-1`}
        >
          Forgot your password?
        </button>
        {loginError && <p className="text-[13px] text-red-600">{loginError}</p>}
        <button type="submit" disabled={isSubmitting} className={authButtonClass}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </Form>
      <p className="mt-6 text-center text-[14px] tracking-[0.6px] text-[rgba(18,18,18,0.85)]">
        <Link to="/account/register" className={authLinkClass}>
          Create an account
        </Link>{' '}
        or{' '}
        <Link to="/" className={authLinkClass}>
          Return to store
        </Link>
      </p>
    </AuthShell>
  );
}
