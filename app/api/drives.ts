// import { parseJSON } from 'date-fns'
// import useSWR, { Fetcher } from 'swr'
import useSWR from 'swr';

import * as api from '@/app/api/network/zooprocess-api';

export function useDrives() {
  // "use server"; Error: × It is not allowed to define inline "use server" annotated Server Actions in Client Components.
  const {
    data = [],
    error = false,
    isLoading = true,
  } = useSWR('/drives/', api.getDrives, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // if ( isLoading==false && error==false ){
  //   console.log("useProjects()")
  //   console.log("  data      -> ", data )
  //   console.log("  isLoading -> ", isLoading )
  //   console.log("  error     -> ", error )
  // }

  return {
    drives: data,
    isLoading,
    isError: error,
  };
}
