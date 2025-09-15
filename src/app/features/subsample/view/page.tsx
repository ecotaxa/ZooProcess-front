import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubSample } from 'api/zooprocess-api.ts';
import type { SubSample } from 'api/interfaces.ts';
import { ScanTypeEnum } from 'api/interfaces.ts';
import { useAuth } from 'app/stores/auth-context.tsx';
import { type BreadcrumbItem, ProjectBreadcrumbs } from 'app/components/breadcrumbs.tsx';
import { fetchSubsampleBreadcrumbsAndData } from 'app/lib/breadcrumbs-utils.ts';
import { MyImage } from 'app/components/myImage.tsx';

export const SubsampleViewPage = () => {
  // Get the parameters from the URL
  const { projectId, sampleId, subsampleId } = useParams();
  const { authState } = useAuth();

  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Breadcrumbs like in process page
  const noBc: BreadcrumbItem = { id: '', name: '' };
  const [breadcrumbsList, setBreadcrumbsList] = useState<BreadcrumbItem[]>([noBc, noBc, noBc]);
  const [breadcrumbsReady, setBreadcrumbsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId || !sampleId || !subsampleId) {
      return;
    }
    fetchSubsampleBreadcrumbsAndData(authState.accessToken!, projectId, sampleId, subsampleId)
      .then(({ breadcrumbs }) => {
        setBreadcrumbsList(breadcrumbs);
        setBreadcrumbsReady(true);
      })
      .catch(error => {
        setError('Failed to fetch project data: ' + (error?.message ?? String(error)));
        // Even if breadcrumbs fail, allow the image to load instead of blocking forever
        setBreadcrumbsReady(true);
      });
  }, [projectId, sampleId, subsampleId, authState.accessToken]);

  useEffect(() => {
    getSubSample(authState.accessToken!, projectId!, sampleId!, subsampleId!)
      .then(subsampleData => {
        setSubsample(subsampleData);
      })
      .catch(error => {
        setError('Failed to fetch subsample data ' + error);
      });
  }, [projectId]);

  return (
    <div className="container mx-auto p-4">
      <ProjectBreadcrumbs items={breadcrumbsList}></ProjectBreadcrumbs>
      <h1 className="text-2xl font-bold mb-4">View Scan</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mt-4">
          {loading && <p>Loading scan image...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {subsample && breadcrumbsReady ? (
            <MyImage
              src={subsample.scan?.find(s => s.type === ScanTypeEnum.SCAN && !s.deleted)?.url ?? ''}
              alt="Scan"
              legend="Scan"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <p className="text-gray-500">Subsample data not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
