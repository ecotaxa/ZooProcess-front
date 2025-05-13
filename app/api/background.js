"use server";

import * as api from '@/app/api/network/zooprocess-api';
import { getScan } from './network/scan';

// Server-side functions for data fetching
export async function fetchBackgrounds(projectId) {
  if (projectId == undefined) {
    return {
      backgrounds: [],
      isError: { message: "Cannot determine the project" }
    };
  }
  
  try {
    const data = await api.getBackgrounds(`/projects/${projectId}/backgrounds`);
    return { backgrounds: data };
  } catch (error) {
    return { backgrounds: [], isError: error };
  }
}

export async function fetchScan(scanId) {
  if (scanId == undefined) {
    return {
      scan: null,
      isError: { message: "Cannot determine the scan" }
    };
  }
  
  try {
    const data = await getScan(`/scan/${scanId}`);
    return { scan: data };
  } catch (error) {
    return { scan: null, isError: error };
  }
}

export async function fetchShowScan(scanId) {
  if (scanId == undefined) {
    return {
      scan: null,
      isError: { message: "Cannot determine the scan" }
    };
  }
  
  try {
    const data = await getScan(`/scan/${scanId}?show`);
    return { scan: data };
  } catch (error) {
    return { scan: null, isError: error };
  }
}

export async function fetchSampleScans(projectId) {
  if (projectId == undefined) {
    return {
      scans: [],
      isError: { message: "Cannot determine the project" }
    };
  }
  
  try {
    const data = await api.getBackgrounds(`/projects/${projectId}/scans`);
    return { scans: data };
  } catch (error) {
    return { scans: [], isError: error };
  }
}
