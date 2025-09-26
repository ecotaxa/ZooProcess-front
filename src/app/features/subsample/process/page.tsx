import React, { type Key, useEffect, useMemo, useState } from 'react';
import {
  deleteSubsample,
  exportToEcoTaxa,
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
import { fetchSubsampleBreadcrumbsAndData } from 'app/lib/breadcrumbs-utils.ts';
import { SubsampleProcessTimeline } from 'app/features/subsample/process/timeline.tsx';
import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { ScanCheckPage } from 'app/features/subsample/process/process.tsx';
import VignetteList from 'app/features/subsample/process/VignetteList.tsx';
import { Button } from '@heroui/button';
import { EcoTaxaLoginForm } from 'app/features/ecotaxa/ecotaxa-login-form';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { useNavigate } from 'react-router-dom';

const MULTIPLE_SCORE_THRESHOLD = 0.4;

export const SubsampleProcessPage = () => {
  // Get the parameters from the URL
  const { projectId, sampleId, subsampleId } = useRequiredParams([
    'projectId',
    'sampleId',
    'subsampleId',
  ]);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const noBc: BreadcrumbItem = { id: '', name: '' };

  const [error, setError] = useState<string | null>(null);

  const [breadcrumbsList, setBreadcrumbsList] = useState<BreadcrumbItem[]>([noBc, noBc, noBc]);
  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [step, setStep] = useState<number | null>(null);

  // Common task
  const [task, setTask] = useState<ITask | null>(null);
  const [showInvalidModal, setShowInvalidModal] = useState(false);

  const [maskScan, setMaskScan] = useState<Scan | null>(null); // Target of step 0
  const [vignettes, setVignettes] = useState<VignetteData[] | null>(null); // Target of step 1
  const [ecotaxaToken, setEcotaxaToken] = useState<string | null>(null); // Intermediate of step 2
  const [ecotaxaProjects, setEcotaxaProjects] = useState<EcotaxaProjects | null>(null); // Intermediate of step 2
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null); // Intermediate of step 3

  // Derived counts reactively computed from vignettes
  const vignettesCount = useMemo(() => (vignettes ? vignettes.length : null), [vignettes]);
  const vignettesMultipleCount = useMemo(() => {
    if (!vignettes) return null;
    return vignettes.filter(v => (v.score ?? 0) > MULTIPLE_SCORE_THRESHOLD).length;
  }, [vignettes]);

  function loadOrLaunchProcess() {
    processSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(result => {
        setTask(result.task);
      })
      .catch(error => {
        setError('Failed to launch processing' + error.message);
      });
  }

  function markSubsampleAs(status: string) {
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
    fetchSubsampleBreadcrumbsAndData(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(({ breadcrumbs, subsample }) => {
        setBreadcrumbsList(breadcrumbs);
        setSubsample(subsample);
      })
      .catch(error => {
        setError('Failed to fetch project data: ' + error.message);
      });
  }, [projectId, sampleId, subsampleId, authState.accessToken]);

  useEffect(() => {
    if (subsample === null) {
      return;
    }

    if (
      subsample.state === SubSampleStateEnum.ACQUIRED ||
      subsample.state === SubSampleStateEnum.SEGMENTATION_FAILED
    ) {
      setStep(0);
      loadOrLaunchProcess();
    } else if (subsample.state === SubSampleStateEnum.SEGMENTED) {
      setStep(0);
      const maskScan = subsample.scan.find(s => s.type === ScanTypeEnum.V10_MASK && !s.deleted);
      setMaskScan(maskScan ?? null);
      getVignettes(authState.accessToken!, projectId, sampleId, subsampleId).then(rrsp => {
        setVignettes(rrsp.data ?? null);
      });
    } else if (
      subsample.state === SubSampleStateEnum.MSK_APPROVED ||
      subsample.state === SubSampleStateEnum.MULTIPLES_GENERATION_FAILED
    ) {
      setStep(1);
      setVignettes(null); // There is some blinking as the vignettes were fetched before the subsample was marked as approved
      loadOrLaunchProcess();
    } else if (subsample.state === SubSampleStateEnum.MULTIPLES_GENERATED) {
      setStep(1);
      getVignettes(authState.accessToken!, projectId, sampleId, subsampleId).then(rrsp => {
        setVignettes(rrsp.data);
      });
    } else if (subsample.state === SubSampleStateEnum.SEPARATION_VALIDATION_DONE) {
      setStep(2);
    }
  }, [subsample]);

  function fetchSubsample() {
    getSubSample(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(subsampleData => {
        setSubsample(subsampleData);
      })
      .catch(error => {
        setError('Failed to fetch subsample data: ' + error.message);
      });
  }

  useEffect(() => {
    if (task === null) {
      return;
    }
    if (task.status === TaskStatusEnum.FAILED) {
      setError(`Task #${task.id} failed: ${task.log} `);
      return;
    }
    if (task.status === TaskStatusEnum.FINISHED) {
      fetchSubsample();
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
    markSubsampleAs('approved');
  }

  function onSeparateOK() {
    markSubsampleAs('separated');
  }

  function onMaskInvalid() {
    setShowInvalidModal(true);
  }

  function onConfirmInvalidMask() {
    setShowInvalidModal(false);
    deleteSubsample(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(() => {
        navigate(`/dashboard?project=${encodeURIComponent(projectId)}`);
      })
      .catch(error => {
        setError('Failed to delete subsample: ' + (error?.message || error));
      });
  }

  function scanCheckPage() {
    return (
      <>
        <div className="flex items-center gap-2">
          {vignettesCount !== null && (
            <span className="text-sm text-gray-600">
              {vignettesCount} objects of which {vignettesMultipleCount ?? 0} may be multiple
            </span>
          )}
        </div>
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
  function retryOnError() {
    if (step === 0 || step === 1) {
      deleteSubsample(authState.accessToken!, projectId, sampleId, subsampleId)
        .then(() => {
          setError(null);
          fetchSubsample();
        })
        .catch(error => {
          setError('Failed to clear job error: ' + (error?.message || error));
        });
    } else if (step === 2) {
    } else {
      window.location.reload(); // For network problems or other weirdness
    }
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
        {error && (
          <div className="mb-2">
            <Button
              className="bg-blue-400 hover:bg-blue-600 text-white font-small py-1 px-3 rounded-md transition-colors"
              onPress={() => {
                retryOnError();
              }}
            >
              Retry
            </Button>
          </div>
        )}
        {!error && task && (
          <p className="text-amber-500">
            Task #{task.id}: {task.log}
          </p>
        )}
        {step == 0 && scanCheckPage()}
        {step == 1 && separatePage()}
        {step == 2 && uploadPage()}
      </CardBody>
      {showInvalidModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowInvalidModal(false)}
          backdrop="blur"
          placement="center"
          scrollBehavior={'inside'}
          isDismissable={false}
        >
          <ModalContent>
            <ModalHeader>Invalid mask</ModalHeader>
            <ModalBody>
              <p>
                The mask will marked as invalid. Please return to ZooProcess v8 and re-scan the
                subsample.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onConfirmInvalidMask}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Card>
  );
};
