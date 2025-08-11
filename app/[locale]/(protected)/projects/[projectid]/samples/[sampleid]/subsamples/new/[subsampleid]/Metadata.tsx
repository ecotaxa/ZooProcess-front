// import { eState } from "./state"
import { Project, Sample, SubSample } from '@/app/api/network/interfaces';
import SubSampleForm from './SubSampleFormUpdate';

const onValidFraction = () => {
  console.log('onValid');
};

// const Metadata = (project: Project|any, subsampleid:string, current: eState, nextState: eState, onCancel: any , setCurrent: (state: eState) => void) => {
export function Metadata(param: {
  project: Project | any;
  sample: Sample;
  subsample: SubSample;
  // current: eState;
  // nextState: eState;
  // setCurrent: (etate: eState) => void;
  onCancel: () => void;
  onValid: () => void;
}) {
  // const { project, sample, subsample, current, nextState, setCurrent } = param;
  const { project, sample, subsample, onValid, onCancel } = param;
  // if ( current != eState.metadata )  {
  //     return <></>
  // }

  const onValidFraction = () => {
    console.log('---- onValid');
    onValid();
  };

  console.log('Metadata project: ', project);
  console.log('Metadata subsambpleid: ', subsample.id);

  // const gotoInfo = () => {
  //     setCurrent(nextState)
  // }

  return (
    <>
      <SubSampleForm
        {...{
          projectid: project.id,
          sampleid: sample.id,
          subsampleid: subsample.id,
          subsample,
          onCancel,
          onChange: onValidFraction,
        }}
      />
    </>
  );
}
