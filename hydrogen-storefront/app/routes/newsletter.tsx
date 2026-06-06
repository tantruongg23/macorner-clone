import type {Route} from './+types/newsletter';

type SubscribeResult =
  | {success: true; error?: never}
  | {success?: never; error: string};

export async function action({request}: Route.ActionArgs): Promise<SubscribeResult> {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {error: 'Please enter a valid email'};
  }

  const payload: Record<string, unknown> = {
    data: {
      type: 'subscription',
      attributes: {
        custom_source: 'footer_form',
        profile: {
          data: {
            type: 'profile',
            attributes: {email},
          },
        },
      },
    },
  };

  const listId = process.env.KLAVIYO_LIST_ID;
  if (listId) {
    (payload.data as Record<string, unknown>).relationships = {
      list: {data: {type: 'list', id: listId}},
    };
  }

  try {
    const res = await fetch(
      'https://a.klaviyo.com/client/subscriptions/?company_id=RjKbJv',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          revision: '2024-10-15',
        },
        body: JSON.stringify(payload),
      },
    );

    // Klaviyo returns 202 Accepted on success
    if (res.ok || res.status === 202) return {success: true};
    return {error: 'Something went wrong, please try again.'};
  } catch {
    return {error: 'Something went wrong, please try again.'};
  }
}
