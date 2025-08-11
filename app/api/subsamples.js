// "use server";

// // import useSWR from 'swr'

// import * as api from '@/app/api/network/zooprocess-api'

// export const isPlainObject = (val) =>
//   Object.prototype.toString.call(val) === '[object Object]';

// // export async function addSubSample({ projectId, sampleId, data }) {
// //   console.log("adding SubSample...projectId: ", projectId, ", sampleId: ", sampleId);
// //   console.log("adding SubSample...data: ", data);

// //   try {
// //     const response = await api.addSubSample(projectId, sampleId, data);

// //     if (response.status === 200) {
// //       return Promise.resolve({ data: response, message: "SubSample has been added" });
// //     } else {
// //       console.warn("⚠️ API returned non-200:", response.data);
// //       return Promise.reject(new Error(response.data?.error || "Unknown server error"));
// //     }
// //   } catch (error) {
// //     console.error("❌ Server has an issue:", error);

// //     // AxiosError: extractions

// //     if ( isPlainObject(error) ) {
// //       console.debug("🛟 isPlainObject")
// //       return Promise.reject(error)
// //     }

// //     const msg =
// //       error?.response?.data?.error ||
// //       error?.response?.data?.message ||
// //       error?.message ||
// //       "Unknown server error";

// //       console.error("🔥 Error:",msg)
// //     return Promise.reject(new Error(msg));
// //   }
// // }

// /** Erreur métier pour la validation serveur */
// export class ValidationError extends Error {
//   constructor(public payload: unknown) {
//     super('Validation failed');
//     this.name = 'ValidationError';
//   }
// }

// export async function addSubSample(
//   projectId: string,
//   sampleId: string,
//   data: unknown,
// ) {
//   try {
//     const res = await axios.post(
//       `/projects/${projectId}/samples/${sampleId}/subsamples/new`,
//       data,
//     );

//     return { ok: true, data: res.data } as const;
//   } catch (err) {
//     /* --- axios.isAxiosError est préférable à isPlainObject --- */
//     if (axios.isAxiosError(err) && err.response?.status === 422) {
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

// function safeParse(str: unknown) {
//   if (typeof str !== 'string') return str;
//   try {
//     return JSON.parse(str);
//   } catch {
//     return str;
//   }
// }

//   export async function updateSubSample({projectId, sampleId, subSampleId, data}){

//     console.log("update SubSample...projectId: ", projectId, ", sampleId: ", sampleId);

//     console.log("update SubSample...data: ", data);

//     return api.updateSubSample(projectId, sampleId, subSampleId, data)
//     .then((response) => {
//       console.log("SubSample added OK");
//       return Promise.resolve( { data:response, message:"SubSample have been updated"})
//     })
//     .catch ((error) =>  {
//       console.error("SubSample added NOK: ", error);
//       console.log("projectid: ", projectId);
//       console.log("sampleid: ", sampleId);
//       console.log("data:", data);

//         console.error("❌ error.message", error.message);
//       throw (error.message)
//     })

//   }
