import {
  type Project,
  type Sample,
  ScanTypeEnum,
  type SubSample,
  SubSampleStateEnum,
} from 'api/interfaces';

// Interface for flattened project structure
export interface ProjectItem {
  scanCount: number;
  subsample: SubSample;
  sample: Sample;
  project: Project;
  actions: Array<string>;
}

export function itemsFromProjects(response: Array<Project>) {
  // Transform the projects data into a flat list of ProjectItem objects
  const items: ProjectItem[] = [];

  for (const project of response) {
    if (project.samples.length === 0) {
      continue;
    }

    for (const sample of project.samples) {
      if (sample.subsample.length === 0) {
        continue;
      }

      for (const subsample of sample.subsample) {
        const nb_scans = subsample.scan.filter(scan => scan.type == ScanTypeEnum.SCAN).length;
        // Add an entry with count of "scans"
        const actions = [];
        if (subsample.state !== SubSampleStateEnum.EMPTY) {
          actions.push('View', 'Process');
        }
        items.push({
          scanCount: nb_scans,
          subsample,
          sample,
          project,
          actions: actions,
        });
      }
    }
  }
  return items;
}
