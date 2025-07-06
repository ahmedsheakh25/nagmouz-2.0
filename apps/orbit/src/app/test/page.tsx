import { supabase } from '@/lib/supabaseClient';

export default async function TestPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .limit(10);

  const envSecure = !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your_anon_key');

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">❌ Supabase Connection Error</h1>
        <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-green-600">✅ Supabase Connected</h1>
          <p className={envSecure ? "text-green-600" : "text-red-600"}>
            {envSecure ? "🔐 Environment secure" : "⚠️ Environment using template values"}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Projects from Supabase:</h2>
          <div className="p-4 bg-gray-50 rounded border border-gray-200">
            {projects?.length ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(projects, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-600">No projects found (empty list)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 