import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
      <main className="flex flex-col items-center justify-between p-24 bg-gray-300 animate-pulse">
        <div className="text-black">
          <p>Loading...</p>
          <Spinner/>
        </div>
      </main>
    );
  }