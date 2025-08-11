// "use server"

// import { addScan as addScanAPI } from "@/app/api/network/scan"

// export async function addScan(image: {
//     url: string,
//     instrumentId: string,
//     projectId: string,
//     subsampleId: string
// }) {
//     return addScanAPI(image)
// }

import { addScan as apiAddScan } from '@/app/api/network/scan.ts';

export async function addScan(data: any) {
  try {
    const result = await apiAddScan(data);

    if (data.projectId) {
      revalidatePath(`/projects/${data.projectId}`);
    }

    return result;
  } catch (error: any) {
    console.error('Error in scan-actions:', error);

    // Si l'erreur est déjà une chaîne JSON, la transmettre telle quelle
    if (typeof error === 'string' && error.startsWith('{')) {
      throw new Error(error);
    }

    // Sinon, créer une nouvelle erreur
    throw new Error(
      typeof error === 'string'
        ? error
        : JSON.stringify({
            message: error.message ?? 'Failed to add scan',
            details: error.details ?? null,
          })
    );
  }
}
