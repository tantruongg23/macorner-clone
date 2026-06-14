import type {Route} from './+types/account_.register';

// The Customer Account API uses a single Shopify-hosted page for both sign-in
// and sign-up (Shop / Google / email + "Create account"). Send registrations
// through the same OAuth login flow.
export async function loader({context}: Route.LoaderArgs) {
  return context.customerAccount.login();
}
