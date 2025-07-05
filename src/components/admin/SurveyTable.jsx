import { useEffect, useState } from 'react';
import api from '../../api';

export default function SurveyTable() {
  const [allSurveys, setAllSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await api.get('/api/survey/all');
        setAllSurveys(res.data);
      } catch (err) {
        setError('Could not load survey responses.');
      } finally {
        setLoading(false);
      }
    }
    fetchSurveys();
  }, []);

  return (
    <div className="p-8 bg-[--primary-bg] text-[--text-color]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[--accent-blue] mb-6">Survey Responses</h1>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-[--secondary-bg]">
              <tr>
                <th className="p-4 font-bold">Username</th>
                <th className="p-4 font-bold">Rating</th>
                <th className="p-4 font-bold">Happy?</th>
                <th className="p-4 font-bold">Suggestion</th>
                <th className="p-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center p-4 text-red-500">{error}</td></tr>
              ) : allSurveys.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4 text-gray-500">No survey responses yet.</td></tr>
              ) : (
                allSurveys.map((s, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-semibold text-[--accent-blue]">{s.user}</td>
                    <td className="p-4">{s.rating} / 5</td>
                    <td className="p-4">{s.happyIfClosed ? '😊' : '😞'}</td>
                    <td className="p-4 max-w-xs break-words">{s.suggestion || <span className="text-gray-400">—</span>}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 