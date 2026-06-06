import {redirect} from 'react-router';
import type {Route} from './+types/account_.logout';

// Log out can only be done via POST/action to avoid CSRF and accidental logouts.
export async function loader() {
  return redirect('/');
}

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.logout();
}
