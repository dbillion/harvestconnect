import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://u5v6rhzh.us-west.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NjI1NzN9.d02U4Vs5hOrC7P9Y2_jHCATWR5vi_0J84SQRrVA7sxA'
});
