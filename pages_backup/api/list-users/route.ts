import { NextRequest, NextResponse } from 'next/server';
import admin from 'lib/firebase-admin';

export async function GET() {
  try {
    const users = await admin.auth().listUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
