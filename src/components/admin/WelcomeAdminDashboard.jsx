import { useEffect, useState } from 'react';
import api from '../../api';

export default function WelcomeAdminDashboard() {
  const [survey, setSurvey] = useState(null);
  useEffect(() => {
    api.get('/api/survey/summary').then(res => setSurvey(res.data));
  }, []);

  return (
    <div className="p-8 bg-[--primary-bg] text-[--text-color]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[--accent-blue] mb-4">Welcome, Admin!</h1>
        <p className="text-lg text-gray-600 mb-8">This is your control panel to manage levels, questions, and users.</p>

        {survey && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Avg. Rating</h2>
              <p className="text-3xl font-bold text-[--accent-blue]">{survey.avgRating} / 5</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Total Responses</h2>
              <p className="text-3xl font-bold text-[--accent-blue]">{survey.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Happy Users</h2>
              <p className="text-3xl font-bold text-green-500">{survey.happyCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Unhappy Users</h2>
              <p className="text-3xl font-bold text-red-500">{survey.unhappyCount}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Add new quiz levels with questions.</li>
            <li>Edit or delete existing ones easily.</li>
            <li>Monitor and improve the quiz experience.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
