import { FC } from 'react';

import { MyForm } from '@/components/myForm';
import { inputFormElements, inputFormElementsMapTest } from '@/config/formElements';
import { useState } from 'react';
import { addSample } from '@/app/api/samples';
// import { Debug } from '@/components/Debug';
import { debug, debugForm, isDebugFormEnabled } from '@/config/settings';
import { sampleTestData } from '@/config/tests/sample_data';
import { Project } from '@/app/api/network/interfaces';
import {
  CustomError,
  removeDigest,
  removeDigestFromError,
  removeDigestSafe,
} from '@/app/api/digest';

const forms = [inputFormElements];

interface pageProps {
  project: Project;
}
const NewSampleForm: FC<pageProps> = ({ project }) => {
  const navigate = useNavigate();
  // console.log("NewSample params: ", params);
  // console.log("NewSample params projectid: ", params.params.projectid);
  // console.log("NewSample params projectid: ", projectid);
  // console.log("NewSample params projectid: ", params.projectid);

  const projectId = project.id;

  const emptyData = {
    scientific_program: 'ZooProcess',
  };

  // need to init form by injection to permit easy configuration of the form, easy change the form elements
  const form: any = [];
  form['forms'] = forms;
  form['value'] = isDebugFormEnabled('project') ? sampleTestData : emptyData; // testData
  form['title'] = 'Sample metadata';
  form['subtitle'] = 'Fill all the mandatory fields.';

  const [stringifiedData, setData] = useState('');

  const prepareData = (data: any) => {
    let newData = {
      ...data,
      projectId: projectId,
    };
    console.log('newData: ', newData);
    return newData;
  };

  const onChange = async (value: any) => {
    console.log('App onChange:', value);

    setData(JSON.stringify(value, null, 2));
    console.log('App onChange:', stringifiedData);

    const data = {
      name: `${projectId}_${value.sample_id}`, //"Sample XXXX",
      metadataModelId: '6565df171af7a84541c48b20',
      data: value,
    };

    console.log('newData: ', data);

    console.log('----- projectId : ', projectId);
    console.log('----- name : ', data.name);
    // console.log("----- params.projectid : ",params.projectid);
    // console.log("----- params : ",params);
    // console.log("----- params.params : ",params.params);

    // addSample(projectId, data)
    return addSample({
      projectId, // : params.params.projectid,
      data,
    });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <>
      <Head>
        <title>New Sample Metadata | ZooProcess</title>
      </Head>
      {/* <Debug params={params}/> */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
          <MyForm
            {...form}
            project={project.name}
            onChange={async (value: any) => {
              try {
                const response = await onChange(value);
                console.log('Go To the sample page');
                navigate(`samples/${response.data.id}`);
                return Promise.resolve(response); // response;
              } catch (error: any) {
                const customError = error as CustomError;
                console.log('Error adding sample:', error);
                console.log('customError adding sample:', customError);
                console.log('customError.obj adding sample:', customError.obj);
                console.error('customError.digest adding sample:', customError?.digest); // Safely check digest

                console.log('Full error details:', JSON.stringify(error, null, 2));

                // const errorObject = { message: "An error occurred", digest: "3967790229" };
                // console.log("typeof error: ", typeof error);
                const cleanedObject = removeDigestFromError(error);

                console.log('Cleaned Object:', cleanedObject);
                throw cleanedObject.message;
              }
            }}
            onCancel={onCancel}
          />
        </div>
      </section>
    </>
  );
};

export default NewSampleForm;
