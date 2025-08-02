// "use server";

// import { addBackgroundTask } from '@/app/api/tasks';
import { Card, CardBody } from '@heroui/react';
import { useEffect, useState } from 'react';
import { MyImage } from 'app/components/myImage.tsx';

// import { add } from "date-fns";

export function ScanCheckPage(
  params: Readonly<{
    mask_url: string;
  }>
) {
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // addTask(params.project, [params.background1, params.background2])
    //   .then(result => setTaskId(result))
    //   .catch(error => console.error('Task error:', error));
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Card className="inline-block size-full" data-testid="ScanCard">
      <CardBody className="p-6">
        <div className="bg-100 p-6">
          <h1 className="text-center">Mask file</h1>
          <div>
            <MyImage src={params.mask_url} alt="Mask" legend="Mask" />
          </div>
          {/* <div>
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            // Render task result
                            <div>Task ID : {taskId}</div>
                        )}
                    </div> */}
        </div>
      </CardBody>
    </Card>
  );
}
