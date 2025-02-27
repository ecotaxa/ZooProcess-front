'use client' 
 
import { ErrorComponent } from '@/components/ErrorComponent'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      {/* <img src="/public/images/404.jpg" alt="404 error" /> */}
      {/* <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button> */}
      Error: {error.message}
      <ErrorComponent error={error} />
    </div>

  )
}