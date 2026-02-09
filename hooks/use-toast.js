// A simple toast hook implementation for the application
let toasts = [];

export function useToast() {
  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type };
    toasts = [...toasts, toast];
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);

    return id;
  };

  const removeToast = (id) => {
    toasts = toasts.filter(toast => toast.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast,
    toast: addToast // alias for convenience
  };
}

// Simple toast component to render the toasts
export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-md shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}