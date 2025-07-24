// Form wrapper component with save button pattern for settings management
import React, { useState, useEffect } from 'react';
import { usePendingChanges, useIsLoading, useErrors, useSettingsActions } from '../../store';

interface SettingsFormProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSave?: () => Promise<void> | void;
  onReset?: () => Promise<void> | void;
  className?: string;
  showActions?: boolean;
  validateForm?: () => string[] | null; // Return array of error messages or null if valid
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  children,
  title,
  description,
  onSave,
  onReset,
  className = '',
  showActions = true,
  validateForm,
}) => {
  const [localErrors, setLocalErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const pendingChanges = usePendingChanges();
  const isLoading = useIsLoading();
  const globalErrors = useErrors();
  const { saveSettings, resetChanges } = useSettingsActions();

  // Combine local and global errors
  const allErrors = [...localErrors, ...globalErrors];

  // Clear local errors when global errors change (they might be related)
  useEffect(() => {
    if (globalErrors.length > 0) {
      setLocalErrors([]);
    }
  }, [globalErrors]);

  const handleSave = async () => {
    try {
      // Clear previous local errors
      setLocalErrors([]);

      // Run form validation if provided
      if (validateForm) {
        const validationErrors = validateForm();
        if (validationErrors && validationErrors.length > 0) {
          setLocalErrors(validationErrors);
          return;
        }
      }

      setIsSaving(true);

      // Run custom save logic if provided
      if (onSave) {
        await onSave();
      }

      // Always call the global save settings
      await saveSettings();

      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      setLocalErrors([`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setLocalErrors([]);
      setIsResetting(true);

      // Run custom reset logic if provided
      if (onReset) {
        await onReset();
      }

      // Call the global reset changes
      await resetChanges();

      console.log('Changes reset successfully');
    } catch (error) {
      console.error('Reset failed:', error);
      setLocalErrors([`Reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsResetting(false);
    }
  };

  const isFormDisabled = isLoading || isSaving || isResetting;
  const canSave = pendingChanges && !isFormDisabled;
  const canReset = pendingChanges && !isFormDisabled;

  return (
    <div className={`settings-form ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {allErrors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {allErrors.length === 1 ? 'There was an error:' : 'There were errors:'}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc pl-5 space-y-1">
                  {allErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className={`settings-form-content ${isFormDisabled ? 'opacity-60 pointer-events-none' : ''}`}>
        {children}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 text-sm">
              {pendingChanges && (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Unsaved changes
                </div>
              )}
              {isLoading && (
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!canReset}
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  canReset
                    ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800 cursor-not-allowed'
                }`}
              >
                {isResetting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </div>
                ) : (
                  'Reset'
                )}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  canSave
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;