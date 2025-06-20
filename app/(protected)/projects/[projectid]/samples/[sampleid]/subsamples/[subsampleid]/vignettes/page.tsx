// import VignetList from './VignetList';
import { fetchVignetteData } from '@/components/lib/api';


import dynamic from 'next/dynamic'
const VignetList = dynamic(() => import('@/components/VignetList'), { ssr: false })

interface PageProps {
  params: {
    projectid: string;
    sampleid: string;
    subsampleid: string;
  };
}

export default async function TestPage({ params }: PageProps) {
  const { projectid, sampleid, subsampleid } = params;
  const { data, folder } = await fetchVignetteData(projectid, sampleid, subsampleid);

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
