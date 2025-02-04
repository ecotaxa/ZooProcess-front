'use client';

export default function Error(error: Error) {
  return (
    <main className="flex flex-col items-center justify-between p-24 bg-red-300">
      <div className="text-black">
        <h1>Something went wrong</h1>
        <div>{error.message}</div>
      </div>
    </main>
  );
}