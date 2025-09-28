import {
  type Project,
  type Sample,
  ScanTypeEnum,
  type SubSample,
  SubSampleStateEnum,
} from 'api/interfaces';
import type { ZPIconName } from '../../../icons';

// Interface for flattened project structure
export interface ProjectItem {
  project: Project;
  sample: Sample;
  subsample: SubSample;
  stateLabel: string;
  buttonTitle?: string;
  viewable: boolean; // can link to the view page
  action?: 'process'; // main action that triggers icon in UI
  icon?: ZPIconName; // optional icon name to represent state/action
}

function stateToLabel(
  state: SubSampleStateEnum
): [string, 'process' | undefined, ZPIconName | undefined, string | undefined] {
  switch (state) {
    case SubSampleStateEnum.EMPTY:
      return ['No scan', undefined, 'pages', undefined];
    case SubSampleStateEnum.ACQUIRED:
      return ['Scanned', 'process', 'process', 'Approve mask'];
    case SubSampleStateEnum.SEGMENTATION_FAILED:
      return ['Mask missing', 'process', 'process', 'Approve mask'];
    case SubSampleStateEnum.SEGMENTED:
      return ['Mask available', 'process', 'process', 'Approve mask'];
    case SubSampleStateEnum.MSK_APPROVED:
      return ['Mask approved', 'process', 'wave', 'Approve multiples'];
    case SubSampleStateEnum.MULTIPLES_GENERATED:
      return ['Multiples available', 'process', 'wave', 'Approve multiples'];
    case SubSampleStateEnum.MULTIPLES_GENERATION_FAILED:
      return ['Multiples missing', 'process', 'wave', 'Approve multiples'];
    case SubSampleStateEnum.SEPARATION_VALIDATION_DONE:
      return ['Multiples approved', 'process', 'upload', 'Upload'];
    case SubSampleStateEnum.UPLOAD_FAILED:
      return ['Upload missing', 'process', 'upload', 'Upload'];
    case SubSampleStateEnum.UPLOADED:
      return ['Uploaded to EcoTaxa', undefined, 'upload', undefined];
    default:
      return [state, undefined, undefined, undefined];
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
        const viewable = subsample.state !== SubSampleStateEnum.EMPTY;
        const [stateLabel, tupleAction, icon, title] = stateToLabel(subsample.state);
        const action = tupleAction ?? (viewable ? 'process' : undefined);
        const buttonTitle = action ? (title ?? 'foo') : undefined;

        const displayName = subsample.name.startsWith(sample.name)
          ? subsample.name.slice(sample.name.length + 1).trim()
          : subsample.name;

        items.push({
          stateLabel,
          buttonTitle,
          subsample: {
            ...subsample,
            name: displayName,
          },
          sample,
          project,
          viewable,
          action,
          icon,
        });
      }
    }
  }
  return items;
}
