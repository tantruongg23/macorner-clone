import {useState, useRef, useEffect} from 'react';

export interface PersonalizationField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'image';
  required?: boolean;
  maxLength?: number;
  options?: string[];
  placeholder?: string;
}

interface PersonalizerProps {
  fields: PersonalizationField[];
  onChange: (values: Record<string, string>) => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
}

export function Personalizer({
  fields,
  onChange,
  onUploadStatusChange,
}: PersonalizerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    onUploadStatusChange?.(isUploading);
  }, [isUploading]);

  if (fields.length === 0) return null;

  function updateValue(key: string, value: string) {
    const next = {...values, [key]: value};
    setValues(next);
    onChange(next);
    if (errors[key]) {
      setErrors((prev) => {
        const {[key]: _, ...rest} = prev;
        return rest;
      });
    }
  }

  function validateField(field: PersonalizationField, value: string) {
    if (field.required && !value.trim()) {
      setErrors((prev) => ({...prev, [field.key]: `${field.label} is required`}));
    }
  }

  return (
    <div className="bg-[#f6f6f6] rounded-xl p-4 flex flex-col gap-3">
      <p className="text-sm font-bold text-[rgb(18,18,18)] text-center uppercase tracking-wider">
        Personalized
      </p>
      {fields.map((field) => (
        <FieldInput
          key={field.key}
          field={field}
          value={values[field.key] ?? ''}
          error={errors[field.key]}
          onChange={(val) => updateValue(field.key, val)}
          onBlur={() => validateField(field, values[field.key] ?? '')}
          onUploadStatusChange={setIsUploading}
        />
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
  onBlur,
  onUploadStatusChange,
}: {
  field: PersonalizationField;
  value: string;
  error?: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  onUploadStatusChange: (isUploading: boolean) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'done' | 'error'
  >('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Revoke object URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const labelEl = (
    <label className="text-sm font-medium text-[rgb(18,18,18)]">
      {field.label}
      {field.required && <span className="text-[#f36621] ml-0.5">*</span>}
    </label>
  );

  const errorEl = error ? (
    <p className="text-xs text-red-500">{error}</p>
  ) : null;

  if (field.type === 'text') {
    return (
      <div className="flex flex-col gap-1.5">
        {labelEl}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={field.placeholder ?? `Enter ${field.label}`}
            maxLength={field.maxLength}
            className="w-full px-3 py-2.5 rounded-lg border border-[rgba(18,18,18,0.2)] text-sm text-[rgb(18,18,18)] placeholder-[rgba(18,18,18,0.35)] focus:outline-none focus:border-[#f36621] transition-colors pr-12"
          />
          {field.maxLength && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[rgba(18,18,18,0.4)]">
              {value.length}/{field.maxLength}
            </span>
          )}
        </div>
        {errorEl}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1.5">
        {labelEl}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={field.placeholder ?? `Enter ${field.label}`}
          maxLength={field.maxLength}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-[rgba(18,18,18,0.2)] text-sm text-[rgb(18,18,18)] placeholder-[rgba(18,18,18,0.35)] focus:outline-none focus:border-[#f36621] transition-colors resize-y"
        />
        {errorEl}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="flex flex-col gap-1.5">
        {labelEl}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="w-full px-3 py-2.5 rounded-lg border border-[rgba(18,18,18,0.2)] text-sm text-[rgb(18,18,18)] focus:outline-none focus:border-[#f36621] transition-colors bg-white"
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errorEl}
      </div>
    );
  }

  if (field.type === 'image') {
    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;

      // Immediate preview via object URL (not data-URL)
      const objectUrl = URL.createObjectURL(file);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(objectUrl);
      setUploadStatus('uploading');
      setUploadError(null);
      onUploadStatusChange(true);
      onChange('');

      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload-image', {method: 'POST', body: fd});
        const json = (await res.json()) as {cdnUrl?: string; error?: string};
        if (!res.ok || json.error) throw new Error(json.error ?? 'Upload failed');
        onChange(json.cdnUrl!);
        setUploadStatus('done');
      } catch (err) {
        onChange('');
        setUploadStatus('error');
        setUploadError(
          err instanceof Error ? err.message : 'Photo upload failed — please try again',
        );
      } finally {
        onUploadStatusChange(false);
      }
    }

    function handleRemove() {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setUploadStatus('idle');
      setUploadError(null);
      onChange('');
      onUploadStatusChange(false);
      if (fileRef.current) fileRef.current.value = '';
    }

    return (
      <div className="flex flex-col gap-1.5">
        {labelEl}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadStatus === 'uploading'}
            className="px-4 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded-lg text-[rgb(18,18,18)] hover:border-[#f36621] hover:text-[#f36621] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadStatus === 'uploading' ? 'Uploading…' : 'Choose Photo'}
          </button>

          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Remove photo"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gray-600 text-white text-[10px] flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {uploadStatus === 'error' && (
          <p className="text-xs text-red-500">
            {uploadError ?? 'Photo upload failed — please try again'}
          </p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
        <a
          href="/pages/photo-upload-guidelines"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#f36621] underline"
        >
          View photo upload guidelines
        </a>
        {errorEl}
      </div>
    );
  }

  return null;
}

export function parsePersonalizationFields(
  metafieldValue: string | null | undefined,
): PersonalizationField[] {
  if (!metafieldValue) return [];
  try {
    const parsed = JSON.parse(metafieldValue);
    if (!Array.isArray(parsed)) return [];
    return parsed as PersonalizationField[];
  } catch {
    return [];
  }
}
