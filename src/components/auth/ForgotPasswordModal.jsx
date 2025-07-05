import { useState } from 'react';
import api from '../../api';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { emailOrUsername });
      setStep(2);
      setSuccess('আপনার ইমেইলে একটি রিসেট কোড পাঠানো হয়েছে।');
    } catch (err) {
      setError(err.response?.data?.error || 'রিসেট কোড পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { emailOrUsername, code, newPassword });
      setSuccess('পাসওয়ার্ড রিসেট হয়েছে। আপনি এখন লগইন করতে পারেন।');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmailOrUsername('');
    setCode('');
    setNewPassword('');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content p-6 max-w-sm mx-4 animate-bounce-in relative">
        <button
          onClick={handleClose}
          className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
          aria-label="Close forgot password modal"
        >
          ×
        </button>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">পাসওয়ার্ড ভুলে গেছেন</h2>
          <p className="text-sm text-gray-600">দুই ধাপে আপনার পাসওয়ার্ড রিসেট করুন</p>
        </div>
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">ইমেইল বা ব্যবহারকারীর নাম</label>
              <input
                className="input"
                type="text"
                value={emailOrUsername}
                onChange={e => setEmailOrUsername(e.target.value)}
                placeholder="আপনার ইমেইল বা ব্যবহারকারীর নাম লিখুন"
                required
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            {success && <div className="text-green-600 text-center text-sm">{success}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'পাঠানো হচ্ছে...' : 'রিসেট কোড পাঠান'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">রিসেট কোড</label>
              <input
                className="input"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="আপনার ইমেইল থেকে কোড লিখুন"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">নতুন পাসওয়ার্ড</label>
              <input
                className="input"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            {success && <div className="text-green-600 text-center text-sm">{success}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'রিসেট হচ্ছে...' : 'পাসওয়ার্ড রিসেট করুন'}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center text-green-700 font-bold text-lg py-8">
            পাসওয়ার্ড রিসেট হয়েছে! আপনি এখন লগইন করতে পারেন।<br />
            <button
              className="btn btn-secondary mt-4"
              onClick={handleClose}
            >
              লগইনে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 