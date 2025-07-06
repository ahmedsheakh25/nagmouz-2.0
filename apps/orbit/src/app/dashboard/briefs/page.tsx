import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { BriefsTable } from './briefs-table';

export default async function BriefsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: briefs } = await supabase
    .from('briefs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Briefs</h1>
      </div>
      <BriefsTable briefs={briefs || []} />
    </div>
  );
}
