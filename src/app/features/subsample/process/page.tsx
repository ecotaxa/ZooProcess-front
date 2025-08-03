import React, { useEffect, useState } from 'react';
import { getProject, getSubSample, getTask, processSubSample } from 'api/zooprocess-api.ts';
import type { IProcessRsp, ITask, Scan, SubSample } from 'api/interfaces.ts';
import { ScanTypeEnum } from 'api/interfaces.ts';
import { useAuth } from 'app/stores/auth-context.tsx';
import { ProjectBreadcrumbs, type BreadcrumbItem } from 'app/components/breadcrumbs.tsx';
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

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbsList, setBreadcrumbsList] = useState<(string | BreadcrumbItem)[]>(['', '', '']);
  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [maskScan, setMaskScan] = useState<Scan | null | undefined>(null);
  const [task, setTask] = useState<ITask | null | undefined>(null);

  function refreshTask() {}

  useEffect(() => {
    // Fetch the full project and navigate manually
    getProject(authState.accessToken!, projectId)
      .then(projectData => {
        const newBreadcrumbsList: (string | BreadcrumbItem)[] = [projectData.name];

        // Navigate through the project structure to find the specific sample
        const sample = projectData.samples.find(sample => sample.id === sampleId);
        if (!sample) {
          throw new Error(`Sample with ID ${sampleId} not found in project`);
        }
        newBreadcrumbsList.push(sample.name);

        // Navigate through sample to find the specific subsample
        const subsampleData = sample.subsample.find(subsample => subsample.id === subsampleId);
        if (!subsampleData) {
          throw new Error(`Subsample with ID ${subsampleId} not found in sample`);
        }

        newBreadcrumbsList.push(subsampleData.name);
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

  function refreshTaskAndScan(result: IProcessRsp) {
    getTask(authState.accessToken!, result.task!.id)
      .then(task => {
        setTask(task);
        return getSubSample(authState.accessToken!, projectId, sampleId, subsampleId);
      })
      .then(subsampleData => {
        setSubsample(subsampleData);
      })
      .catch(error => {
        setError('Failed to fetch task or subsample data: ' + error.message);
      });
  }

  useEffect(() => {
    if (subsample === null) return;
    const maskScan = subsample.scan.find(s => s.type === ScanTypeEnum.V10_MASK && !s.deleted);
    let interval: any;
    if (maskScan === undefined) {
      processSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
        .then(result => {
          setTask(result.task);
          interval = setTimeout(() => {
            refreshTaskAndScan(result);
          }, 1000);
        })
        .catch(error => {
          setError('Failed to launch processing' + error.message);
        });
    }
    setMaskScan(maskScan);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [subsample]);

  function onValid() {}

  function onCancel() {}

  return (
    <Card className="container mx-auto p-4">
      <CardHeader className="flex justify-between items-center mb-4">Scan processing</CardHeader>
      {breadcrumbsList.length > 0 && (
        <ProjectBreadcrumbs list={breadcrumbsList}></ProjectBreadcrumbs>
      )}
      <SubsampleProcessTimeline current={0} list={[]}></SubsampleProcessTimeline>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mt-4">
          {loading && <p>Loading scan data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {task && <>Task ID : {task.log}</>}
          {maskScan && (
            <>
              <ScanCheckPage mask_url={maskScan.url} />
              meta:{maskScan.url}
            </>
          )}
          {!maskScan && !loading && <p className="text-gray-500">Scan data not available.</p>}
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
