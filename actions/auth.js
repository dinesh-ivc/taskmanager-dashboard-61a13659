'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
    return { error: 'Invalid credentials' };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function register(formData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: {
        name: formData.get('name'),
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Registration error:', error);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}