import {CartForm} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/cart';
import {CartMain} from '~/components/CartMain';

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let result: Record<string, unknown>;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Error(`Unknown cart action: ${action}`);
  }

  const cartId = (result as {cart?: {id?: string}})?.cart?.id;
  const headers = cartId ? cart.setCartId(cartId) : new Headers();

  const resultErrors = (result as {errors?: Array<unknown>})?.errors;
  const status = Array.isArray(resultErrors) && resultErrors.length > 0 ? 400 : 200;

  return Response.json(result, {status, headers});
}

export async function loader({context}: Route.LoaderArgs) {
  return context.cart.get();
}

export default function CartPage() {
  const cart = useLoaderData<typeof loader>();
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <CartMain cart={cart} layout="page" />
    </div>
  );
}
