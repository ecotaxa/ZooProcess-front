'use client';

import useSWR from 'swr';
// import * as api from '@/app/api/network/zooprocess-api';
import { getBackgrounds } from '@/app/api/network/background';
import { getScan } from '@/app/api/network/scan';

export function useBackgrounds(projectId) {
  if (projectId == undefined) {
    return {
      backgrounds: [],
      isLoading: false,
      isError: { message: "Cannot determine the project" }
    };
  }

  const { data = [], error = false, isLoading = true } = useSWR(
    `/projects/${projectId}/backgrounds`, 
    api.getBackgrounds, 
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    backgrounds: data,
    isLoading,
    isError: error
  };
}

export function useGetScan(scanId) {
  if (scanId == undefined) {
    return {
      scan: [],
      isLoading: false,
      isError: { message: "Cannot determine the scan" }
    };
  }

  const { data = undefined, error = false, isLoading = true } = useSWR(
    `/scan/${scanId}`,
    getScan,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    scan: data,
    isLoading,
    isError: error
  };
}

export function useShowScan(scanId) {
  if (scanId == undefined) {
    return {
      scan: [],
      isLoading: false,
      isError: { message: "Cannot determine the scan" }
    };
  }

  const { data = undefined, error = false, isLoading = true } = useSWR(
    `/scan/${scanId}?show`,
    getScan,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    scan: data,
    isLoading,
    isError: error
  };
}

export function useSampleScans(projectId) {
  if (projectId == undefined) {
    return {
      scans: [],
      isLoading: false,
      isError: { message: "Cannot determine the project" }
    };
  }

  const { data = [], error = false, isLoading = true } = useSWR(
    `/projects/${projectId}/scans`,
    api.getBackgrounds,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  return {
    scans: data,
    isLoading,
    isError: error
  };
}
