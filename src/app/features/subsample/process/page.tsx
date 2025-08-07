import React, { useEffect, useState } from 'react';
import {
  getProject,
  getSubSample,
  getTask,
  markSubSample,
  processSubSample,
} from 'api/zooprocess-api.ts';
import {
  type IMarkSubsampleReq,
  type ITask,
  type Scan,
  ScanTypeEnum,
  type SubSample,
  TaskStatusEnum,
} from 'api/interfaces.ts';
import { useAuth } from 'app/stores/auth-context.tsx';
import { type BreadcrumbItem, ProjectBreadcrumbs } from 'app/components/breadcrumbs.tsx';
import { useRequiredParams } from 'app/lib/router-utils.ts';
import { SubsampleProcessTimeline } from 'app/features/subsample/process/timeline.tsx';
import { Button, Card, CardFooter, CardHeader } from '@heroui/react';
import { ScanCheckPage } from 'app/features/subsample/process/process.tsx';

export const SubsampleProcessPage = () => {
  // Get the parameters from the URL
  const { projectId, sampleId, subsampleId } = useRequiredParams([
    'projectId',
    'sampleId',
    'subsampleId',
  ]);
  const { authState } = useAuth();

  const noBc: BreadcrumbItem = { id: '', name: '' };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [breadcrumbsList, setBreadcrumbsList] = useState<BreadcrumbItem[]>([noBc, noBc, noBc]);
  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [maskScan, setMaskScan] = useState<Scan | null>(null);
  const [task, setTask] = useState<ITask | null>(null);

  useEffect(() => {
    // Fetch the full project and navigate manually
    getProject(authState.accessToken!, projectId)
      .then(projectData => {
        const newBreadcrumbsList: BreadcrumbItem[] = [
          { id: projectData.id, name: projectData.name },
        ];

        // Navigate through the project structure to find the specific subsample
        const sample = projectData.samples.find(sample => sample.id === sampleId);
        if (!sample) {
          throw new Error(`Sample with ID ${sampleId} not found in project`);
        }
        newBreadcrumbsList.push({ id: sample.id, name: sample.name });
        const subsampleData = sample.subsample.find(subsample => subsample.id === subsampleId);
        if (!subsampleData) {
          throw new Error(`Subsample with ID ${subsampleId} not found in sample`);
        }
        newBreadcrumbsList.push({ id: subsampleData.id, name: subsampleData.name });
        setBreadcrumbsList(newBreadcrumbsList);
        setSubsample(subsampleData);
      })
      .catch(error => {
        setError('Failed to fetch project data: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [projectId, sampleId, subsampleId, authState.accessToken]);

  useEffect(() => {
    if (subsample === null) {
      return;
    }
    const maskScan = subsample.scan.find(s => s.type === ScanTypeEnum.V10_MASK && !s.deleted);
    setMaskScan(maskScan ?? null);
  }, [subsample]);

  useEffect(() => {
    if (maskScan !== null) {
      return;
    }
    if (task === null) {
      processSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
        .then(result => {
          setTask(result.task);
        })
        .catch(error => {
          setError('Failed to launch processing' + error.message);
        });
    }
  }, [maskScan]);

  useEffect(() => {
    if (task === null) {
      return;
    }
    if (task.status === TaskStatusEnum.FAILED) {
      setError('Task failed: ' + task.log);
      return;
    }
    if (task.status === TaskStatusEnum.FINISHED) {
      getSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
        .then(subsampleData => {
          setSubsample(subsampleData);
        })
        .catch(error => {
          setError('Failed to fetch subsample data: ' + error.message);
        });
      return;
    }
    const timeout = setTimeout(() => {
      getTask(authState.accessToken!, task.id)
        .then(task => {
          setTask(task);
        })
        .catch(error => {
          setError('Failed to fetch task data: ' + error.message);
        });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [task]);

  function onValid() {
    const req: IMarkSubsampleReq = { status: 'approved' };
    markSubSample(authState.accessToken!, projectId, sampleId, subsampleId, req)
      .then(result => {})
      .catch(error => {
        setError('Failed to mark scan' + error.message);
      });
  }

  function onCancel() {}

  return (
    <Card className="container mx-auto p-4">
      <CardHeader className="flex justify-between items-center mb-4">Scan processing</CardHeader>
      {breadcrumbsList.length > 0 && (
        <ProjectBreadcrumbs items={breadcrumbsList}></ProjectBreadcrumbs>
      )}
      <SubsampleProcessTimeline current={0} list={[]}></SubsampleProcessTimeline>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mt-4">
          {loading && <p>Loading scan data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {task && (
            <>
              Task #{task.id}: {task.log}
            </>
          )}
          {maskScan && (
            <>
              <ScanCheckPage mask_url={maskScan.url} />
              meta:{maskScan.url}
            </>
          )}
          {!maskScan && !loading && <p className="text-gray-500">Mask not yet available.</p>}
        </div>
      </div>
      {maskScan && (
        <CardFooter className="flex justify-between py-3">
          <Button
            color="primary"
            variant="solid"
            data-testid="scanIsValidBtn"
            onPress={() => {
              onValid();
            }}
          >
            This scan is OK
          </Button>
          <Button
            color="warning"
            variant="solid"
            data-testid="scanIsValidBtn"
            onPress={() => {
              onCancel();
            }}
          >
            This scan is bad
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
