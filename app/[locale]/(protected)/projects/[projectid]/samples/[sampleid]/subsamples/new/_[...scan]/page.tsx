import { Debug } from '@/components/Debug';
import { Button, Card, CardBody, CardFooter, Image } from '@heroui/react';
import { FC } from 'react';

type pageProps = {
  params: {
    projectid: string;
    sampleid: string;
    scan: string[];
  };
};

const scan: FC<pageProps> = ({ params }) => {
  console.log('params: ', params);
  const { projectid, sampleid, scan } = params;

  console.log('scan: ', scan);
  // const [scantxt, id, action] = scan
  const [scantxt, id, actionpath] = scan;

  let action = 'preview';

  if (actionpath != undefined) {
    action = actionpath;
  } else {
  }

  type Step = {
    step: string;
    text: string;
  };

  const actions: Array<Step> = [
    {
      step: 'preview',
      text: 'Preview',
    },
    {
      step: 'background',
      text: 'Background',
    },
    {
      step: 'scan',
      text: 'Scan',
    },
    {
      step: 'finish',
      text: 'Finish',
    },
  ];

  const currentStep = actions.filter(action => action.step);

  // const defineImagePath = (id:string) => {
  //     return "/public/Sipho.png"
  //     return "./background.tif"
  //     return `${id}.tif`
  // }

  // const actions : Map<string,string> = {"preview":"Preview","background":"Background","scan":"Scan","finish":"Finish"}

  const isThisStep = (element: Step) => {
    return element.step == action;
  };
  const nextAction = (action: string): string => {
    const index = actions.findIndex(isThisStep);

    if (index < actions.length) return actions[index + 1].step;
    return 'finish';
  };

  return (
    <>
      <Debug params={params} />
      Scan
      <Card className="inline-block size-full" data-testid="projectCard">
        <CardBody>
          <div>
            <b>project Id: </b> {projectid}
          </div>
          <div>
            <b>sample Id: </b> {sampleid}
          </div>
          <div>
            <b>scan: </b> {scan}
          </div>

          <div>
            <b>scantxt: </b> {scantxt}
          </div>
          <div>
            <b>id: </b> {id}
          </div>
          <div>
            <b>action: </b> {action}
          </div>

          <div className="size-full bg-white">
            <Image
              //   width={300}
              alt="NextUI hero Image"
              // src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
              // src="/images/hero-card-complete.jpeg"
              src="/images/background.jpg"
              // src="/images/Sipho.jpg"
            />
          </div>
        </CardBody>

        <CardFooter className="flex flex-row-reverse py-3">
          <Button
            color="primary"
            // showAnchorIcon
            variant="solid"
            data-testid="newProjectBtn"
            // >Scan {actions[nextAction(action)]}</Button>
          >
            Scan {action.text}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default scan;
