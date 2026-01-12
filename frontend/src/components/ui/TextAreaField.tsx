import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import clsx from 'clsx';

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  rows?: number;
}

export const TextAreaField = ({
  label,
  registration,
  error,
  placeholder,
  rows = 3,
}: Props) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...registration}
        className={clsx(
          'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors resize-none',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
};
