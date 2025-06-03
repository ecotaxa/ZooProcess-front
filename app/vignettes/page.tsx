// import VignetList from './VignetList';
import { fetchVignetteData } from '@/components/lib/api';


import dynamic from 'next/dynamic'
const VignetList = dynamic(() => import('./VignetList'), { ssr: false })

export default async function TestPage() {
  const { data, folder } = await fetchVignetteData();

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* Zoom à gauche */}
      <div className="w-[320px] bg-black flex items-center justify-center">
        {/* Zoom est géré en fixed dans VignetList */}
      </div>

      {/* Liste à droite */}
      <div className="flex-1">
        <VignetList initialVignettes={data} folder={folder} />
      </div>
    </main>
  );
}
