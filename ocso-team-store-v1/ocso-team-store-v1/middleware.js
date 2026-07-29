import { NextResponse } from 'next/server';
import { valid } from './lib/auth';
export function middleware(req){const p=req.nextUrl.pathname;if(p.startsWith('/store')&&!valid(req.cookies.get('store_auth')?.value,'store'))return NextResponse.redirect(new URL('/',req.url));if(p.startsWith('/admin')&&!valid(req.cookies.get('admin_auth')?.value,'admin'))return NextResponse.redirect(new URL('/admin-login',req.url));return NextResponse.next()}
export const config={matcher:['/store/:path*','/admin/:path*']};
