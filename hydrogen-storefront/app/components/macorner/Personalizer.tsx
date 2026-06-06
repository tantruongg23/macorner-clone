import {useState, useRef} from 'react';

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
}

export function Personalizer({fields, onChange}: PersonalizerProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});

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
          preview={previews[field.key]}
          onChange={(val) => updateValue(field.key, val)}
          onBlur={() => validateField(field, values[field.key] ?? '')}
          onPreview={(dataUrl) =>
            setPreviews((prev) => ({...prev, [field.key]: dataUrl}))
          }
        />
      ))}
    </div>
  );
}

function FieldInput({
  field,
  value,
  error,
  preview,
  onChange,
  onBlur,
  onPreview,
}: {
  field: PersonalizationField;
  value: string;
  error?: string;
  preview?: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  onPreview: (dataUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

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
    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be under 10 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        onPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }

    return (
      <div className="flex flex-col gap-1.5">
        {labelEl}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 text-sm border border-[rgba(18,18,18,0.2)] rounded-lg text-[rgb(18,18,18)] hover:border-[#f36621] hover:text-[#f36621] transition-colors"
          >
            Choose Photo
          </button>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-12 h-12 object-cover rounded border border-gray-200"
            />
          )}
        </div>
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
