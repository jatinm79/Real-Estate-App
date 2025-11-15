'use client';

import { useState } from 'react';
import { healthCheck } from '@/lib/api';

export default function ConnectionTest() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);
      setStatus('Testing connection...');
      
      const result = await healthCheck();
      setStatus(` Success: ${result.message}`);
    } catch (error) {
      console.error('Connection test failed:', error);
      setStatus(` Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Backend Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="btn btn-primary mb-2"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {status && (
        <p className={`text-sm ${
          status.includes('✅') ? 'text-green-600' : 'text-red-600'
        }`}>
          {status}
        </p>
      )}
    </div>
  );
}