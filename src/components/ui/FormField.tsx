import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputFieldProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {}

export function InputField({
  label,
  error,
  hint,
  required,
  id,
  className,
  ...props
}: InputFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#2D1810]"
      >
        {label}
        {required && (
          <span className="text-[#8B1A2B] ml-1" aria-label="wajib diisi">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-[#6B5C52]">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-[#2D1810] placeholder:text-[#A89080]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#8B1A2B] focus:border-transparent',
          error
            ? 'border-red-500 bg-red-50 focus:ring-red-500'
            : 'border-[#DDD0C8] hover:border-[#8B1A2B]/40',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectFieldProps
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  placeholder?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function SelectField({
  label,
  error,
  hint,
  required,
  id,
  placeholder,
  options,
  className,
  ...props
}: SelectFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#2D1810]">
        {label}
        {required && (
          <span className="text-[#8B1A2B] ml-1" aria-label="wajib diisi">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-[#6B5C52]">
          {hint}
        </p>
      )}
      <select
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-[#2D1810] appearance-none',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#8B1A2B] focus:border-transparent',
          'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238B1A2B\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]',
          error
            ? 'border-red-500 bg-red-50 focus:ring-red-500'
            : 'border-[#DDD0C8] hover:border-[#8B1A2B]/40',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaFieldProps
  extends BaseFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {}

export function TextareaField({
  label,
  error,
  hint,
  required,
  id,
  className,
  ...props
}: TextareaFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#2D1810]">
        {label}
        {required && (
          <span className="text-[#8B1A2B] ml-1" aria-label="wajib diisi">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-[#6B5C52]">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        rows={3}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-[#2D1810] placeholder:text-[#A89080] resize-none',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-[#8B1A2B] focus:border-transparent',
          error
            ? 'border-red-500 bg-red-50 focus:ring-red-500'
            : 'border-[#DDD0C8] hover:border-[#8B1A2B]/40',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxFieldProps {
  id: string;
  label: React.ReactNode;
  error?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export function CheckboxField({
  id,
  label,
  error,
  checked,
  onChange,
  disabled,
}: CheckboxFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 w-4 h-4 rounded border-[#DDD0C8] text-[#8B1A2B] focus:ring-[#8B1A2B] cursor-pointer accent-[#8B1A2B]"
        />
        <label htmlFor={id} className="text-sm text-[#2D1810] cursor-pointer leading-relaxed">
          {label}
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
