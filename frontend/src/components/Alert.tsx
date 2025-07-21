import { AlertProps } from '../types';

export default function Alert({ type, message }: AlertProps) {
  const alertClasses = {
    error: 'bg-red-50 text-red-800',
    warning: 'bg-yellow-50 text-yellow-800',
    info: 'bg-blue-50 text-blue-800'
  };

  return (
    <div className={`rounded-md p-4 ${alertClasses[type]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {type === 'error' && <ExclamationIcon />}
          {type === 'warning' && <ExclamationIcon />}
          {type === 'info' && <InformationCircleIcon />}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{message}</h3>
        </div>
      </div>
    </div>
  );
}

// Simple icons (replace with your actual icon components)
const ExclamationIcon = () => (
  <svg className="h-5 w-5 text-current" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

const InformationCircleIcon = () => (
  <svg className="h-5 w-5 text-current" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
  </svg>
);