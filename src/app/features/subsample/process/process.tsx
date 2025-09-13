import { Button, Card, CardBody, CardFooter } from '@heroui/react';
import React, { useState } from 'react';
import { MyImage } from 'app/components/myImage.tsx';

export function ScanCheckPage(
  params: Readonly<{
    mask_url: string;
    onScanOK: () => void;
    onScanKO: () => void;
  }>
) {
  const [isLoading, setIsLoading] = useState(true);

  const imgDone = () => {
    setIsLoading(false);
  };
  return (
    <Card className="inline-block size-full" data-testid="ScanCard">
      <CardBody className="p-2">
        <div className="bg-100 p-2">
          <div>
            <MyImage src={params.mask_url} alt="Mask" legend="" onLoad={imgDone} />
          </div>
          {!isLoading && (
            <CardFooter className="flex justify-between py-3">
              <Button
                color="primary"
                variant="solid"
                data-testid="scanIsValidBtn"
                onPress={() => {
                  params.onScanOK();
                }}
              >
                This scan is OK
              </Button>
              <Button
                color="warning"
                variant="solid"
                data-testid="scanIsKOBtn"
                onPress={() => {
                  params.onScanKO();
                }}
              >
                This scan is bad
              </Button>
            </CardFooter>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
