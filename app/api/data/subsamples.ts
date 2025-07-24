import { SubSample, SubSamples } from '../network/interfaces';

import * as api from '@/app/api/network/zooprocess-api';

export async function getSubSamples(projectid: string, sampleid: string): Promise<SubSamples> {
  try {
    const subSamples = await api.getSubSamples(
      `/projects/${projectid}/samples/${sampleid}/subsamples`
    );
    return subSamples;
  } catch (error) {
    console.error('Error - getSubSamples()', error);
    throw error;
  }
}

export async function getSubSample(
  projectid: string,
  sampleid: string,
  subsampleid: string
): Promise<SubSample> {
  try {
    const url = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}`;
    console.debug('getSubSample url:', url);
    const subSample = await api.getSubSample(url);
    console.debug('getSubSample:', subSample.id);
    return subSample;
  } catch (error) {
    console.error('Error - getSubSample()', error);
    throw error;
  }
}

// export async function addSubSample(projectid:string, sampleid:string, data:any): Promise<SubSamples> {

//     // const [data, setData] = useState([]);
//     // const [isLoading, setIsLoading] = useState(true);
//     // const [error, setError] = useState(null);

//     // useEffect(() => {
//     //   fetchData();
//     // }, []);

//     // const fetchData = async () => {
//     //   setIsLoading(true);
//     //   try {
//     //     const result = await api.getSubSample(`/projects/${projectId}/samples/${sampleId}/subsamples/${sampleId}`);
//     //     setData(result);
//     //   } catch (err) {
//     //     setError(err);
//     //   } finally {
//     //     setIsLoading(false);
//     //   }
//     // };

//     // const updateData = () => {
//     //   fetchData();
//     // };

//     try {
//     // const subSamples = await api.addSubSample(`/projects/${projectid}/samples/${sampleid}/subsamples`, data)
//     const subSamples = await api.addSubSample(projectid, sampleid,data)
//     return subSamples;
//   } catch (error) {
//     console.error("Error - addSubSample()", error);
//     throw error;
//   }
// }

import axiosInstance from '@/network/axiosInstance';
import axios from 'axios';
import { ValidationError } from '@/lib/errors';

export const isPlainObject = (val: any) =>
  Object.prototype.toString.call(val) === '[object Object]';

function safeParse(str: unknown) {
  if (typeof str !== 'string') return str;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

// export async function addSubSample(
//   projectId: string,
//   sampleId: string,
//   data: unknown,
// ) {
//   try {

//     console.debug("👁️‍🗨️ addSubSample()")

//     // const res = await axios.post(
//     const api = await axiosInstance({})
//     const res = await api.post(
//       `/projects/${projectId}/samples/${sampleId}/subsamples`,
//       data,
//     );

//     return { ok: true, data: res.data } as const;
//   } catch (err:any) {
//     /* --- axios.isAxiosError est préférable à isPlainObject --- */
//     console.debug("❌ addSubSample()")
//     if (axios.isAxiosError(err) && err.response?.status === 422) {
//       console.debug("❌ addSubSample() - 422")
//       const payload =
//         isPlainObject(err.response.data)
//           ? err.response.data
//           : safeParse(err.response.data);

//       // ◀︎ on NE propage PAS AxiosError mais une ValidationError
//       throw new ValidationError(payload);
//     }

//     // autres codes → on laisse Next.js gérer
//     throw err;
//   }
// }

export async function addSubSample(
  projectid: string,
  sampleid: string,
  data: any
): Promise<SubSamples> {
  console.debug('PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP   api/data/addSubSample()');
  try {
    // const api = await axiosInstance({})
    const subSamples = await api.addSubSample(projectid, sampleid, data);
    return subSamples;
  } catch (error: any) {
    console.error('❌ addSubSample() -', error.response?.status);

    if (error.response?.status === 422) {
      // Extract the validation error details from the server response
      // const payload = {
      //     errors: error.response.data?.errors || error.response.data,
      //     message: error.response.data?.message || error.response.errors || "Validation failed"
      // };
      const serverData = error.response.data;
      const payload = {
        errors: serverData?.errors || [],
        message: serverData?.message || 'Validation failed',
      };

      console.error('🔍 Validation payload:', payload);

      // Create ValidationError with the server's error details
      // throw new ValidationError(payload);
      throw new ValidationError(payload.message, payload);
    }

    // For other errors, re-throw as is
    throw error;
  }
}
