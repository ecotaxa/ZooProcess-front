import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProcessPage } from 'app/features/subsample/process.tsx';
import { getSubSample } from 'api/zooprocess-api.ts';
import type { SubSample } from 'api/interfaces.ts';
import { ScanTypeEnum } from 'api/interfaces.ts';
import { useAuth } from 'app/stores/auth-context';

export const SubsamplePage = () => {
  // Get the parameters from the URL
  const { projectId, sampleId, subsampleId, action } = useParams();
  const { authState } = useAuth();

  const [subsample, setSubsample] = useState<SubSample | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubsample = async () => {
      try {
        const subsampleData = await getSubSample(
          authState.accessToken!,
          projectId!,
          sampleId!,
          subsampleId!
        );
        setSubsample(subsampleData);
      } catch (error) {
        setError('Failed to fetch subsample data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubsample();
  }, [projectId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subsample View</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <p>
            <strong>Project ID:</strong> {projectId}
          </p>
          <p>
            <strong>Sample ID:</strong> {sampleId}
          </p>
          <p>
            <strong>Subsample ID:</strong> {subsampleId}
          </p>
          <p>
            <strong>Action:</strong> {action}
          </p>
        </div>

        <div className="mt-4">
          {loading && <p>Loading project data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {subsample ? (
            <ProcessPage
              background1={
                subsample.scan?.find(s => s.type === ScanTypeEnum.SCAN && !s.deleted)?.url ?? ''
              }
              background2={
                subsample.scan?.filter(s => s.type === ScanTypeEnum.BACKGROUND && !s.deleted)[1]
                  ?.url ?? ''
              }
              onCancel={() => {}}
              onValid={() => {}}
            />
          ) : (
            <p className="text-gray-500">Project data not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubsamplePage;
