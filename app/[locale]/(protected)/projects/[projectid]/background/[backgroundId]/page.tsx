import { useShowScan } from '@/app/api/useBackgrounds';
import { Background } from '@/app/api/network/interfaces';
import { Debug } from '@/components/Debug';
import { ErrorComponent } from '@/components/ErrorComponent';
import { MySpinner } from '@/components/mySpinner';
import { pathToSessionStorage, isTiff } from '@/lib/gateway';
import { Card, CardBody, CardHeader, Image, Spacer } from '@heroui/react';
import { FC } from 'react';

interface pageProps {
  params: {
    projectid: string;
    backgroundId: string;
  };
}

const showBackgroundScan: FC<pageProps> = ({ params }) => {
  const projectId = params.projectid;
  const backgroundId = params.backgroundId;
  console.log('Metadata params: ', params);
  console.log('Metadata params projectid: ', params.projectid);
  console.log('Metadata params backgroundId: ', params.backgroundId);
  console.log('Metadata params projectid: ', projectId);
  console.log('Metadata params backgroundId: ', backgroundId);

  const { scan, isLoading, isError } = useShowScan(backgroundId);

  interface MyScanProps {
    scan: Background | any;
  }

  const ShowImage_old: FC<MyScanProps> = (props: MyScanProps) => {
    if (isLoading) {
      return <MySpinner />;
    }
    if (isError) {
      return <ErrorComponent error={isError} />;
    }

    if (!props.scan || !props.scan.url || props.scan.url === 'undefined') {
      console.debug('scan.url === undefined');
      console.log('scan is undefined or has no valid URL');
      return <div>No scan</div>;
    }

    let path = props.scan.url;
    if (path.substring(0, 1) != '/') {
      path = '/' + path;
    }

    let localPath;
    try {
      localPath = pathToSessionStorage(path, '/');
      console.debug('Generated localPath:', localPath);

      if (!localPath) {
        console.error('pathToSessionStorage returned falsy value:', localPath);
        return <div>Error: Cannot convert the scan</div>;
      }
    } catch (error) {
      console.error('Error in pathToSessionStorage:', error);
      return <div>Error: Failed to process the scan path</div>;
    }

    return (
      <>
        <Image src={localPath} />
        <h2>path: {path}</h2>
        <h2>localpath: {localPath}</h2>
      </>
    );
  };

  const ShowImage: FC<MyScanProps> = props => {
    if (isLoading) {
      return <MySpinner />;
    }
    if (isError) {
      return <ErrorComponent error={isError} />;
    }

    if (!props.scan || !props.scan.url || props.scan.url === 'undefined') {
      console.log('scan is undefined or has no valid URL');
      return <div>No scan</div>;
    }

    let path = props.scan.url;

    // If the path is a TIFF file, we need to convert it to JPG and use the daily folder
    let localPath;
    if (isTiff(path)) {
      // This will create a path to the converted JPG in today's folder
      localPath = pathToSessionStorage(path, '/');
    } else {
      // For non-TIFF files, use the normal path conversion
      if (path.substring(0, 1) !== '/') {
        path = '/' + path;
      }
      localPath = pathToSessionStorage(path, '/');
    }

    if (!localPath) {
      return <div>Error: Cannot convert the scan</div>;
    }

    return (
      <>
        <Image src={localPath} alt="Background scan" />
        <h2>Original path: {path}</h2>
        <h2>Web path: {localPath}</h2>
      </>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <Debug params={scan} title="scan" /> */}
      {scan && <Debug params={scan} title="scan" />}

      <h3>params: {JSON.stringify(params)}</h3>
      <h3>projectId: {projectId}</h3>
      <h3>backgroundId: {backgroundId}</h3>
      <div className="text-center justify-center">
        <Spacer y={5} />
        <Card className="inline-block " data-testid="backgroundCard">
          <CardHeader className="flex flex-row py-3">
            <div></div>
          </CardHeader>
          <CardBody>
            {/* {scan && showImage(scanProps)} */}
            <ShowImage scan={scan} />
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default showBackgroundScan;
