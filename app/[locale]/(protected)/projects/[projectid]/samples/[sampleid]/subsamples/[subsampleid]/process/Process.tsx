import { Button, Card, CardBody, CardFooter, Spinner, Textarea } from '@heroui/react';

import { useEffect, useRef, useState } from 'react';

import {
  IProcess,
  IProcessMultiple,
  Project,
  Sample,
  Scan,
  SubSample,
} from '@/app/api/network/interfaces';
import { MyImage } from '@/components/myImage';
import { Debug } from '@/components/Debug';

const Process = (params: {
  scan?: string;
  background: string;
  scanId: string;
  project: Project;
  sample: Sample;
  subsample: SubSample;
  process: IProcessMultiple;
  taskId: string;
}) => {
  const [error, setError] = useState<string | null>(null);

  let { scan, background, scanId, project, sample, subsample, process, taskId } = params;

  const [currentProcess, setCurrentProcess] = useState<any>(process);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [taskFinished, setTaskFinished] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  const t = useTranslations('SubSample_Process');

  const fetchTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`);
    const data = await response.json();
    return data.data;
  };

  const fetchSubSample = async (projectId: string, sampleId: string, subSampleId: string) => {
    try {
      const response = await fetch(`/api/subsample/${project.id}/${sample.id}/${subsample.id}`);
      const data = await response.json();
      if (!response.ok) {
        console.error('Error fetching subsample response.statusText:', response.statusText);
        console.error('Error fetching subsample data.error:', data.error);
        console.error('Error fetching subsample error:', error);
        console.error('Error fetching subsample data:', data);

        setError(data.error || `HTTP error! status: ${response.status}`);
        return;
      }
      setError(null);
      return data;
    } catch (error: any) {
      setError(error.message || 'Failed to fetch subsample');
      throw error;
    }
  };

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        setIsUpdating(true);
        const task = await fetchTask(taskId);
        const sub_rsp = await fetchSubSample(project.id, sample.id, subsample.id);
        const sub = sub_rsp.data;
        console.log('Sub sample:', sub);
        const mask = sub.scan.find(
          (s: Scan) => s.type == 'MASK' && s.deleted == false && s.archived == false
        );
        const vis = sub.scan.find(
          (s: Scan) => s.type == 'VIS' && s.deleted == false && s.archived == false
        );
        const out = sub.scan.find(
          (s: Scan) => s.type == 'OUT' && s.deleted == false && s.archived == false
        );

        const s = { mask, vis, out, taskId, status: task.status, log: task.log };
        console.debug('*************', s);

        setCurrentProcess(s);

        if (task.status == 'FINISHED' || task.status == 'FAILED') {
          if (task.status == 'FINISHED') {
            setTaskFinished(true);
          } // ok we can go next step
          if (task.status == 'FAILED') {
            setHasFailed(true);
          } // then you can show the failed button to return to the subsample list
          console.log('Stopping interval, task status:', task.status);
          clearInterval(interval);
        }
      } catch (error) {
        console.log('Error fetching task or Sub sample:', error);
        clearInterval(interval);
      } finally {
        setIsUpdating(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [taskId]);

  const navigate = useNavigate();
  const onCancel = () => {
    console.debug('cancel');
    navigate(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}`);
  };

  const gotoCheckStep = () => {
    console.debug('gotoCheckStep');
    navigate(`/projects/${project.id}/samples/${sample.id}/subsamples/${subsample.id}/check`);
  };

  const onReScan = () => {
    console.debug('onReScan');
    navigate(
      `/projects/${project.id}/samples/${sample.id}/subsamples/new/${subsample.id}?state=preview`
    );
  };

  const onChangeFraction = () => {
    console.debug('onChangeFraction');
    navigate(
      `/projects/${project.id}/samples/${sample.id}/subsamples/new/${subsample.id}?state=metadata`
    );
  };

  const returnOnSubSampleList = () => {
    console.debug('returnOnSubSampleList');
    navigate(`/projects/${project.id}/samples/${sample.id}/subsamples/?state=metadata`);
  };

  const showState = (data: IProcess | any) => {
    return (
      <>
        <br />
        showState:
        <br />
        <pre>{JSON.stringify(data, null, 3)}</pre>
        <br />
      </>
    );
  };

  const showStates = (data: IProcessMultiple | any) => {
    return (
      <>
        Status: {data.status}
        {data.log && <Textarea className="max-w-md" value={data.log} readOnly={true} />}
        {taskId != '' && <div>taskId: {taskId}</div>}
        <div className="h-1/2">
          {data.mask && <MyImage src={String(data.mask.url)} legend="Mask" alt="mask" />}
        </div>
      </>
    );
  };

  function ErrorMsg() {
    if (error) {
      return (
        <div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
              <h3 className="text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      <section>{ErrorMsg()}</section>

      <section>
        <Card className="inline-block size-full" data-testid="ProcessCard">
          <CardBody className="p-6">
            <div className="bg-200 p-6">
              <h1 className="text-center">Processing.</h1>
              <div className="flex flex-col text-left my-4">
                <p>project: {project.name}</p>
                <p>sample: {sample.name}</p>
                <p>subsample: {subsample.name}</p>
                <p>scanId: {scanId}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-grow">{showStates(currentProcess)}</div>
                <div className="ml-2 w-6 h-6 flex items-center justify-center">
                  {isUpdating && <Spinner size="sm" color="primary" label="Updating..." />}
                </div>
              </div>
            </div>
          </CardBody>

          <CardFooter className="flex flex-row-reverse py-3">
            <Button
              color="primary"
              variant="solid"
              data-testid="processNextBtn"
              isDisabled={!taskFinished}
              onPress={() => {
                gotoCheckStep();
              }}
            >
              {t('Continue_button')}
            </Button>

            {hasFailed && (
              <Button
                color="secondary"
                variant="solid"
                data-testid="processCanceltBtn"
                onPress={() => {
                  returnOnSubSampleList();
                }}
              >
                {t('Failed_button')}
              </Button>
            )}
            {/* Hidding buttons for future use */}
            {/* <Button 
                    color="secondary"
                    variant="solid"
                    data-testid="processCanceltBtn"
                    onPress={() => onReScan()}
                >{t("Cancel_Scan_Button")}</Button> */}
            {/* <Button 
                    color="danger"
                    variant="solid"
                    data-testid="processCanceltBtn"
                    onPress={() => onChangeFraction()}
                >{t("Cancel_Fraction_Button")}</Button> */}
          </CardFooter>
        </Card>
      </section>
      <section>
        <Debug title="ProcessNewScanPage" params={params} pre={true} />
      </section>
    </>
  );
};

export default Process;
