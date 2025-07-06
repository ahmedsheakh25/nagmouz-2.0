import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .limit(10);

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <pre className="mt-4 p-4 bg-red-50 rounded">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
      <div className="space-y-4">
        <h2 className="text-xl">Projects from Supabase:</h2>
        <pre className="p-4 bg-gray-50 rounded">
          {JSON.stringify(projects, null, 2)}
        </pre>
      </div>
    </div>
  );
} 