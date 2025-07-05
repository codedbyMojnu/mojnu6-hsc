export default function SuccessModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-sm mx-auto text-center relative animate-bounce-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-green-600 text-4xl mb-4">✔</div>
        <div className="text-lg font-semibold mb-2">{message}</div>
        <button onClick={onClose} className="btn btn-primary mt-4">
          ঠিক আছে
        </button>
      </div>
    </div>
  );
}
