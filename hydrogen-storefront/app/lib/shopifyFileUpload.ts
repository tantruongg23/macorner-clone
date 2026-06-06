export class UploadError extends Error {}

const ADMIN_API_VERSION = '2024-01';

async function adminGraphQL(
  shopDomain: string,
  adminToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const res = await fetch(
    `https://${shopDomain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  if (!res.ok) {
    throw new UploadError(`Admin API HTTP error: ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: Record<string, unknown>;
    errors?: {message: string}[];
  };
  if (json.errors?.length) {
    throw new UploadError(`Admin API error: ${json.errors[0].message}`);
  }
  return json.data ?? {};
}

export async function uploadFileToShopifyCDN(
  file: File,
  adminToken: string,
  shopDomain: string,
): Promise<string> {
  // Step 1: Create staged upload target
  const stagedData = (await adminGraphQL(
    shopDomain,
    adminToken,
    `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename: file.name,
          mimeType: file.type,
          resource: 'FILE',
          httpMethod: 'POST',
        },
      ],
    },
  )) as {
    stagedUploadsCreate: {
      stagedTargets: {
        url: string;
        resourceUrl: string;
        parameters: {name: string; value: string}[];
      }[];
      userErrors: {field: string; message: string}[];
    };
  };

  const {stagedTargets, userErrors} = stagedData.stagedUploadsCreate;
  if (userErrors.length) {
    throw new UploadError(`stagedUploadsCreate error: ${userErrors[0].message}`);
  }
  const target = stagedTargets[0];
  if (!target) throw new UploadError('No staged target returned');

  // Step 2: POST file to staged upload URL
  const formData = new FormData();
  for (const {name, value} of target.parameters) {
    formData.append(name, value);
  }
  formData.append('file', file);

  const uploadRes = await fetch(target.url, {method: 'POST', body: formData});
  if (!uploadRes.ok) {
    throw new UploadError(`Staged upload failed: ${uploadRes.status}`);
  }

  // Step 3: Finalize via fileCreate
  const fileData = (await adminGraphQL(
    shopDomain,
    adminToken,
    `mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          ... on GenericFile { url }
          ... on MediaImage { image { url } }
        }
        userErrors { field message }
      }
    }`,
    {
      files: [
        {
          originalSource: target.resourceUrl,
          contentType: 'IMAGE',
        },
      ],
    },
  )) as {
    fileCreate: {
      files: ({url?: string} | {image?: {url: string}})[];
      userErrors: {field: string; message: string}[];
    };
  };

  const {files, userErrors: fileErrors} = fileData.fileCreate;
  if (fileErrors.length) {
    throw new UploadError(`fileCreate error: ${fileErrors[0].message}`);
  }
  const created = files[0];
  if (!created) throw new UploadError('No file returned from fileCreate');

  const cdnUrl =
    ('image' in created && created.image?.url) ||
    ('url' in created && created.url) ||
    null;

  if (!cdnUrl) throw new UploadError('CDN URL not found in fileCreate response');
  return cdnUrl;
}
