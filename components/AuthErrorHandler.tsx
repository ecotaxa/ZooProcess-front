// To pass error from server to client part of the application,
// We need to pass the error from the server to the client using Next.js's `useEffect` hook.

// import { useRouter } from "next/navigation";
import { ErrorComponent } from './ErrorComponent';

export default function AuthErrorHandler({ error }: { error: any }) {
  // This is a client component that can use useRouter
  return <ErrorComponent error={error} />;
}
