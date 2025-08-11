import { Debug } from '@/components/Debug';
import { Timeline_scan } from '@/components/timeline-scan';
import { Button, Card, CardBody, CardFooter, Slider, Spinner } from '@heroui/react';
import { FC, useState } from 'react';

import { addSeparateTask } from '@/api/tasks';

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

type pageProps = {
  params: {
    projectid: string;
    sampleid: string;
    subsampleid: string;
  };
  searchParams: SearchParams;
};

const ProcessPage: FC<pageProps> = ({ params, searchParams }) => {
  console.log('ProcessPage');
  console.log('params: ', params);
  console.log('searchParams: ', searchParams);

  const navigate = useNavigate();
  const { projectid, sampleid, subsampleid } = params;
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

  const image = searchParams.image;

  console.log('image: ', image);

  function onPress() {
    // navigate("../scan");
    // const taskId = "65e5c903930f50fae433df9b"
    const data = {
      params: {
        projectid,
        sampleid,
        subsampleid,
        scanId: image,
        // folder:{
        //     src:"",
        //     dst:""
        // }
      },
      // log: {
      //     launch:Date.now()
      //     // user:
      // }
    };

    // const taskId =
    addSeparateTask(data)
      // .then((taskId)=>{
      //     // if ( taskId?.status == 200 ){
      //     //     console.log('Go To the "check" page with taskId: ', taskId.data.id)
      //     //     const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId.data.id}`
      //     //     // navigate(path)
      //     // }
      //     if ( taskId ){
      //         console.log('Go To the "check" page with taskId: ', taskId)
      //         const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId}`
      //         // navigate(path)
      //     }
      // })
      .then(response => {
        console.log('addSeparateTask() response: ', response);
        if (response?.status == 200) {
          const taskId = response.data.taskId;
          console.log('Go To the "check" page with taskId: ', taskId);
          const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${taskId}`;
          // const path = `/projects/${projectid}/samples/${sampleid}/subsamples/${subsampleid}/check/${scanId}`
          navigate(path);
        }
      })
      .catch(error => {
        console.log('error: ', error);
        setShowErrorMsg(true);
      });
  }

  function ErrorMsg() {
    if (showErrorMsg) {
      return (
        <div>
          <Card>
            <CardBody>
              <h1>Error</h1>
              <h3>There is an error with your scan</h3>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={onPress}>
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    } else {
      return <></>;
    }
  }

  let label = 'Processing';

  const list = [
    { text: 'Fill Metadata', checked: true },
    // { text: "Background", checked: false },
    { text: 'Preview', checked: false },
    { text: 'Scan', checked: true },
    { text: 'Process', checked: false },
    { text: 'Check', checked: false },
  ];

  return (
    <>
      <Timeline_scan list={list} current={3} />

      <div className="text-start w-">
        <h1>Processing your scan</h1>
        <div>
          <b>project Id: </b> {projectid}
        </div>
        <div>
          <b>sample Id: </b> {sampleid}
        </div>
        <div>
          <b>subsample Id: </b> {subsampleid}
        </div>
        <div>
          <b>Image Id: </b>
          {image}
        </div>
        <Spinner />
        <Slider
          label={label}
          step={10}
          maxValue={100}
          minValue={0}
          // defaultValue={0.4}
          className="max-w-md"
        />
      </div>
      <ErrorMsg />
      <div>
        <Button onPress={onPress} color="primary">
          Check
        </Button>
      </div>
    </>
  );
};

export default ProcessPage;
