// Prevent static generation for auth callback routes
export const dynamic = 'force-dynamic';

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}