import { getProject } from 'api/zooprocess-api.ts';
import type { BreadcrumbItem } from 'app/components/breadcrumbs.tsx';
import type { SubSample } from 'api/interfaces.ts';

/**
 * Fetch the project and build breadcrumbs down to the subsample, also returning the subsample found in the project tree.
 * This avoids duplicating the same traversal logic across pages.
 */
export async function fetchSubsampleBreadcrumbsAndData(
  token: string,
  projectId: string,
  sampleId: string,
  subsampleId: string
): Promise<{ breadcrumbs: BreadcrumbItem[]; subsample: SubSample }> {
  const projectData = await getProject(token, projectId);

  const breadcrumbs: BreadcrumbItem[] = [{ id: projectData.id, name: projectData.name }];

  const sample = projectData.samples.find((s: any) => s.id === sampleId);
  if (!sample) {
    throw new Error(`Sample with ID ${sampleId} not found in project`);
  }
  breadcrumbs.push({ id: sample.id, name: sample.name });

  const subsample = sample.subsample.find((ss: any) => ss.id === subsampleId);
  if (!subsample) {
    throw new Error(`Subsample with ID ${subsampleId} not found in sample`);
  }
  breadcrumbs.push({ id: subsample.id, name: subsample.name });

  return { breadcrumbs, subsample };
}
