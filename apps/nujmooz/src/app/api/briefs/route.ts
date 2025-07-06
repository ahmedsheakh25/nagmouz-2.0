import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    const { user_name, user_email, service_type, details } = body;
    
    const { data, error } = await supabase
      .from('briefs')
      .insert({
        user_name,
        user_email,
        service_type,
        details,
        status: 'draft'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating brief:', error);
    return NextResponse.json(
      { error: 'Failed to create brief' },
      { status: 500 }
    );
  }
} 