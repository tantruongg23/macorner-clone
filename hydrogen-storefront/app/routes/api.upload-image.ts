import type {Route} from './+types/api.upload-image';
import {uploadFileToShopifyCDN, UploadError} from '~/lib/shopifyFileUpload';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({error: 'Invalid form data'}, {status: 400});
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({error: 'No file provided'}, {status: 400});
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({error: 'Only JPEG, PNG, and WebP images are accepted'}, {status: 400});
  }
  if (file.size > MAX_SIZE) {
    return Response.json({error: 'Image must be under 10 MB'}, {status: 413});
  }

  try {
    const cdnUrl = await uploadFileToShopifyCDN(
      file,
      context.env.SHOPIFY_ADMIN_API_TOKEN,
      context.env.PUBLIC_STORE_DOMAIN,
    );
    return Response.json({cdnUrl});
  } catch (err) {
    const message =
      err instanceof UploadError ? err.message : 'Upload failed — please try again';
    return Response.json({error: message}, {status: 500});
  }
}
