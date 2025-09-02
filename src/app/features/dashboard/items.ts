import {
  type Project,
  type Sample,
  ScanTypeEnum,
  type SubSample,
  SubSampleStateEnum,
} from 'api/interfaces';

// Interface for flattened project structure
export interface ProjectItem {
  state: string;
  subsample: SubSample;
  sample: Sample;
  project: Project;
  actions: Array<string>;
}

function stateToLabel(state: SubSampleStateEnum) {
  switch (state) {
    case SubSampleStateEnum.EMPTY:
      return 'No scan';
    case SubSampleStateEnum.ACQUIRED:
      return 'Scanned';
    case SubSampleStateEnum.SEGMENTED:
      return 'Mask available';
    case SubSampleStateEnum.MSK_APPROVED:
      return 'Mask approved';
    case SubSampleStateEnum.MULTIPLES_GENERATED:
      return 'Multiples available';
    case SubSampleStateEnum.SEPARATION_VALIDATION_DONE:
      return 'Multiples approved';
    case SubSampleStateEnum.UPLOADING:
      return 'Uploading to EcoTaxa';
    case SubSampleStateEnum.UPLOADED:
      return 'Uploaded to EcoTaxa';
    default:
      return state;
  }
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

        const displayName = subsample.name.startsWith(sample.name)
          ? subsample.name.slice(sample.name.length + 1).trim()
          : subsample.name;

        items.push({
          state: stateToLabel(subsample.state),
          subsample: {
            ...subsample,
            name: displayName,
          },
          sample,
          project,
          actions: actions,
        });
      }
    }
  }
  return items;
}
