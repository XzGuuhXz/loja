import 'server-only';

import { createHash } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: {
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const admin = createAdminClient();
  const normalized = digest(key.trim().slice(0, 512));
  const { data, error } = await admin.rpc('check_rate_limit', {
    p_key: normalized,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  // Fail closed for protected operations: if the limiter itself is unavailable,
  // do not turn an infrastructure failure into an unlimited endpoint.
  if (error) return { allowed: false, error };
  return { allowed: data === true };
}

export function requestClientKey(request: Request, scope: string) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const ip = forwarded || realIp || 'unknown';
  return `${scope}:${ip}`;
}
