// Global alert system for displaying notifications, errors, and success messages
import React, { useEffect, useState } from 'react';
import { useErrors, useUIActions } from '../../store';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number; // Auto-dismiss after this many milliseconds (0 = no auto-dismiss)
  dismissible?: boolean;
  timestamp: Date;
}

interface AlertSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxAlerts?: number;
  className?: string;
}

// Hook for managing alerts
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (
    type: AlertType,
    message: string,
    options: {
      title?: string;
      duration?: number;
      dismissible?: boolean;
    } = {}
  ) => {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      title: options.title,
      duration: options.duration ?? (type === 'error' ? 0 : 5000), // Errors don't auto-dismiss
      dismissible: options.dismissible ?? true,
      timestamp: new Date(),
    };

    setAlerts(prev => [alert, ...prev]);

    // Auto-dismiss if duration is set
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        dismissAlert(alert.id);
      }, alert.duration);
    }

    return alert.id;
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return {
    alerts,
    addAlert,
    dismissAlert,
    clearAllAlerts,
    // Convenience methods
    error: (message: string, options?: { title?: string; dismissible?: boolean }) =>
      addAlert('error', message, { ...options, duration: 0 }),
    warning: (message: string, options?: { title?: string; duration?: number }) =>
      addAlert('warning', message, options),
    success: (message: string, options?: { title?: string; duration?: number }) =>
      addAlert('success', message, options),
    info: (message: string, options?: { title?: string; duration?: number }) =>
      addAlert('info', message, options),
  };
};

// Individual Alert Component
const AlertItem: React.FC<{
  alert: Alert;
  onDismiss: (id: string) => void;
}> = ({ alert, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(alert.id), 150); // Wait for exit animation
  };

  const getAlertStyles = () => {
    const baseStyles = "p-4 rounded-md shadow-lg border transition-all duration-300 transform";
    const visibilityStyles = isVisible && !isExiting 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";

    switch (alert.type) {
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800`;
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800`;
      case 'info':
        return `${baseStyles} ${visibilityStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`;
    }
  };

  const getIconAndColors = () => {
    switch (alert.type) {
      case 'error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          iconColor: 'text-red-400',
          titleColor: 'text-red-800 dark:text-red-200',
          messageColor: 'text-red-700 dark:text-red-300',
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          iconColor: 'text-yellow-400',
          titleColor: 'text-yellow-800 dark:text-yellow-200',
          messageColor: 'text-yellow-700 dark:text-yellow-300',
        };
      case 'success':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          iconColor: 'text-green-400',
          titleColor: 'text-green-800 dark:text-green-200',
          messageColor: 'text-green-700 dark:text-green-300',
        };
      case 'info':
        return {
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          iconColor: 'text-blue-400',
          titleColor: 'text-blue-800 dark:text-blue-200',
          messageColor: 'text-blue-700 dark:text-blue-300',
        };
    }
  };

  const { icon, iconColor, titleColor, messageColor } = getIconAndColors();

  return (
    <div className={getAlertStyles()}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className="ml-3 flex-1">
          {alert.title && (
            <h3 className={`text-sm font-medium ${titleColor} mb-1`}>
              {alert.title}
            </h3>
          )}
          <p className={`text-sm ${messageColor}`}>
            {alert.message}
          </p>
        </div>
        {alert.dismissible && (
          <div className="ml-auto flex-shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className={`inline-flex rounded-md p-1.5 ${iconColor} hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Alert System Component
export const AlertSystem: React.FC<AlertSystemProps> = ({
  position = 'top-right',
  maxAlerts = 5,
  className = '',
}) => {
  const globalErrors = useErrors();
  const { clearErrors } = useUIActions();
  const { alerts, addAlert, dismissAlert } = useAlerts();

  // Convert global errors to alerts
  useEffect(() => {
    globalErrors.forEach(error => {
      addAlert('error', error, { title: 'Application Error' });
    });
    // Clear global errors after converting to alerts
    if (globalErrors.length > 0) {
      clearErrors();
    }
  }, [globalErrors, addAlert, clearErrors]);

  // Limit number of alerts
  const displayedAlerts = alerts.slice(0, maxAlerts);

  const getPositionStyles = () => {
    const baseStyles = "fixed z-50 pointer-events-none";
    
    switch (position) {
      case 'top-right':
        return `${baseStyles} top-4 right-4`;
      case 'top-left':
        return `${baseStyles} top-4 left-4`;
      case 'bottom-right':
        return `${baseStyles} bottom-4 right-4`;
      case 'bottom-left':
        return `${baseStyles} bottom-4 left-4`;
      case 'top-center':
        return `${baseStyles} top-4 left-1/2 transform -translate-x-1/2`;
      case 'bottom-center':
        return `${baseStyles} bottom-4 left-1/2 transform -translate-x-1/2`;
      default:
        return `${baseStyles} top-4 right-4`;
    }
  };

  if (displayedAlerts.length === 0) {
    return null;
  }

  return (
    <div className={`${getPositionStyles()} ${className}`}>
      <div className="w-96 max-w-sm space-y-3 pointer-events-auto">
        {displayedAlerts.map(alert => (
          <AlertItem
            key={alert.id}
            alert={alert}
            onDismiss={dismissAlert}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertSystem;