import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validatePassword } from '@/lib/validation';
import jwt from 'jsonwebtoken';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request or validation failed
 *       500:
 *         description: Internal server error
 */

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();
    
    // Validate input
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists
    const supabase = createAdminClient();
    
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      email,
      password_hash: hashedPassword,
      full_name: name,
      role: role || 'user',
      is_active: true,
      theme_preference: 'system',
    };

    const { data: newUser, error: createUserError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (createUserError) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
        token
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}