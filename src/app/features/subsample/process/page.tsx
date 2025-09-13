import React, { type Key, useEffect, useState } from 'react';
import {
  exportToEcoTaxa,
  getProject,
  getSubSample,
  getTask,
  getVignettes,
  listEcoTaxaProjects,
  loginToEcoTaxa,
  markSubSample,
  processSubSample,
} from 'api/zooprocess-api.ts';
import {
  type EcotaxaProjects,
  type IMarkSubsampleReq,
  type ITask,
  type Scan,
  ScanTypeEnum,
  type SubSample,
  SubSampleStateEnum,
  TaskStatusEnum,
  type VignetteData,
} from 'api/interfaces.ts';
import { useAuth } from 'app/stores/auth-context.tsx';
import { type BreadcrumbItem, ProjectBreadcrumbs } from 'app/components/breadcrumbs.tsx';
import { useRequiredParams } from 'app/lib/router-utils.ts';
import { SubsampleProcessTimeline } from 'app/features/subsample/process/timeline.tsx';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { ScanCheckPage } from 'app/features/subsample/process/process.tsx';
import VignetteList from 'app/features/subsample/process/VignetteList.tsx';
import { Button } from '@heroui/button';
import { EcoTaxaLoginForm } from 'app/features/ecotaxa/ecotaxa-login-form';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';

export const SubsampleProcessPage = () => {
  // Get the parameters from the URL
  const { projectId, sampleId, subsampleId } = useRequiredParams([
    'projectId',
    'sampleId',
    'subsampleId',
  ]);
  const { authState } = useAuth();

  const noBc: BreadcrumbItem = { id: '', name: '' };

  const [error, setError] = useState<string | null>(null);

  const [breadcrumbsList, setBreadcrumbsList] = useState<BreadcrumbItem[]>([noBc, noBc, noBc]);
  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [step, setStep] = useState<number | null>(null);
  const [maskScan, setMaskScan] = useState<Scan | null>(null); // Target of step 0
  const [vignettes, setVignettes] = useState<VignetteData[] | null>(null); // Target of step 1
  const [ecotaxaToken, setEcotaxaToken] = useState<string | null>(null); // Intermediate of step 2
  const [ecotaxaProjects, setEcotaxaProjects] = useState<EcotaxaProjects | null>(null); // Intermediate of step 2
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  // Common task
  const [task, setTask] = useState<ITask | null>(null);

  function launchProcess() {
    processSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(result => {
        setTask(result.task);
      })
      .catch(error => {
        setError('Failed to launch processing' + error.message);
      });
  }

  function subsampleMark(status: string) {
    const req: IMarkSubsampleReq = { status: status };
    markSubSample(authState.accessToken!, projectId, sampleId, subsampleId, req)
      .then(subsample => {
        setSubsample(subsample);
      })
      .catch(error => {
        setError('Failed to mark scan: ' + error.message);
      });
  }

  useEffect(() => {
    // Fetch the full project and navigate the tree manually
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
      });
  }, [projectId, sampleId, subsampleId, authState.accessToken]);

  useEffect(() => {
    if (subsample === null) {
      return;
    }
    if (subsample.state === SubSampleStateEnum.ACQUIRED) {
      setStep(0);
      launchProcess();
    } else if (subsample.state === SubSampleStateEnum.SEGMENTED) {
      setStep(0);
      const maskScan = subsample.scan.find(s => s.type === ScanTypeEnum.V10_MASK && !s.deleted);
      setMaskScan(maskScan ?? null);
    } else if (subsample.state === SubSampleStateEnum.MSK_APPROVED) {
      setStep(1);
      launchProcess();
    } else if (subsample.state === SubSampleStateEnum.MULTIPLES_GENERATED) {
      setStep(1);
      getVignettes(authState.accessToken!, projectId, sampleId, subsampleId).then(rrsp => {
        setVignettes(rrsp.data);
      });
    } else if (subsample.state === SubSampleStateEnum.SEPARATION_VALIDATION_DONE) {
      setStep(2);
    }
  }, [subsample]);

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

  function onMaskValid() {
    subsampleMark('approved');
  }

  function onSeparateOK() {
    subsampleMark('separated');
  }

  function onMaskInvalid() {}

  function scanCheckPage() {
    return (
      <>
        {!maskScan && <p className="text-gray-500">Mask not available.</p>}
        {maskScan && (
          <ScanCheckPage mask_url={maskScan.url} onScanOK={onMaskValid} onScanKO={onMaskInvalid} />
        )}
      </>
    );
  }

  function separatePage() {
    const folder = `/api/vignette/${projectId}/${sampleId}/${subsampleId}`;
    return (
      <>
        {!vignettes && <p className="text-gray-500">No vignette to verify.</p>}
        {vignettes && <VignetteList initialVignettes={vignettes} folder={folder} />}
        {vignettes && (
          <Button
            className="bg-blue-400 hover:bg-blue-600 text-white font-small w-1/6 mb-1 py-1 px-2 rounded-md transition-colors"
            onPress={() => {
              onSeparateOK();
            }}
          >
            Done separating
          </Button>
        )}
      </>
    );
  }

  function uploadPage() {
    const handleEcoTaxaLogin = (credentials: { username: string; password: string }) => {
      loginToEcoTaxa(authState.accessToken!, credentials.username, credentials.password)
        .then(token => {
          if (token === null) {
            setError('Failed to login to EcoTaxa');
          } else {
            setError(null);
            setEcotaxaToken(token);
            listEcoTaxaProjects(authState.accessToken!, token)
              .then(ecotaxaProjects => {
                setEcotaxaProjects(ecotaxaProjects);
              })
              .catch(error => {
                setError('Failed to list EcoTaxa projects: ' + error.message);
              });
          }
        })
        .catch(error => {
          setError('Failed to login to EcoTaxa: ' + error.message);
        });
    };

    const onProjectSelect = (key: Key | null) => {
      setSelectedProjectId(key as number);
    };

    const handleProjectSubmit = () => {
      if (selectedProjectId) {
        exportToEcoTaxa(
          authState.accessToken!,
          projectId,
          sampleId,
          subsampleId,
          ecotaxaToken!,
          selectedProjectId
        )
          .then(result => {
            setSubsample(result.subsample);
            setTask(result.task);
          })
          .catch(error => {
            setError('Failed to export to EcoTaxa: ' + error.message);
          });
      }
    };

    return (
      <div className="w-full">
        {ecotaxaToken && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">Logged in EcoTaxa.</span>
          </div>
        )}
        {!ecotaxaToken && <EcoTaxaLoginForm onSubmit={handleEcoTaxaLogin} />}
        {ecotaxaProjects && (
          <div className="mt-4">
            <div className="flex flex-col space-y-4">
              <Autocomplete
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={selectedProjectId !== null}
                label="Project to export to:"
                placeholder="Search for a project"
                isRequired={true}
                onSelectionChange={onProjectSelect}
                selectedKey={selectedProjectId}
                labelPlacement={'outside'}
              >
                {ecotaxaProjects.map(project => (
                  <AutocompleteItem key={project.projid}>{project.title}</AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            {selectedProjectId && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">
                  Selected project:{selectedProjectId}
                  {ecotaxaProjects.find(p => p.projid === selectedProjectId)?.title}
                </span>
              </div>
            )}
            {selectedProjectId && (
              <Button
                className="bg-blue-400 hover:bg-blue-600 text-white font-small w-1/4 py-2 px-4 rounded-md transition-colors"
                onPress={handleProjectSubmit}
                isDisabled={!selectedProjectId}
              >
                Export To Project #{selectedProjectId}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <Card className="container mx-auto p-1">
      <CardHeader className="flex justify-between items-center mb-1">
        {/*Scan processing*/}
        <ProjectBreadcrumbs items={breadcrumbsList}></ProjectBreadcrumbs>
        <SubsampleProcessTimeline current={step ?? -1}></SubsampleProcessTimeline>
        {subsample?.state}
      </CardHeader>
      <CardBody>
        {error && <p className="text-red-500">{error}</p>}
        {task && (
          <p className="text-amber-500">
            Task #{task.id}: {task.log}
          </p>
        )}
        {step == 0 && scanCheckPage()}
        {step == 1 && separatePage()}
        {step == 2 && uploadPage()}
      </CardBody>
    </Card>
  );
};
