
"use client"

export default function Page({ params }: { params: { slug: string } }) {
    return (<div>My Post: {params.slug}</div>)
  }


// export default function Page() {
//   return (
//     <main className="flex flex-col items-center justify-between p-24 bg-orange-300">
//       <div className="text-black">
//         <p>Dashboard</p>
//       </div>
//     </main>
//   );
// }