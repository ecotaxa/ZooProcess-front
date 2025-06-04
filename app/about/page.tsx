import VignetteLine from '@/components/VignetteLine';

const mockData = {
  scan: "apero2023_pp_wp2_001_st01_d_d1_1_567.jpg",
  matrix: 'masque_compressé.gz',
  mask: undefined,
  vignettes: undefined,
};

// const loadVignettes = async (): Promise<string[]> => {
//   const res = await fetch('/api/vignettes?id=123'); // Remplace par ton API
//   const json = await res.json();
//   return json.vignettes; // Doit être un tableau de string (URLs)
// };

export default function DemoPage() {

  // const folder = process.env.NEXT_PUBLIC_REAL_FOLDER + "/1"
  const folder = "/test/1"

  return (
    <div className="p-4">
     <VignetteLine
        data={mockData}
        folder={folder}
        apiUrl="/api/vignettes?scanId=scan1"
      />    </div>
  );
}
