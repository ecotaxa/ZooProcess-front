import { Drive } from '@/app/api/network/interfaces';
import { MyForm } from '@/components/myForm';

import { DriveForm as DriveFormDefine } from '@/config/formElements';
import { updateDrive } from '@/app/api/data/drive';
import { useState } from 'react';

const NewDriveForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const initForm = () => {
    let localform: any = {};
    localform['forms'] = DriveFormDefine;
    localform['value'] = {};
    localform['title'] = 'Link Drive';
    localform['subtitle'] = 'Associate a new drive';
    return localform;
  };

  let form = initForm();

  const onChange = async (value: any) => {
    console.debug('onChange drive form');
    const d = value as Drive;
    try {
      setFormError(null);
      return await updateDrive(d);
    } catch (error: any) {
      console.debug('updateDrive failed with HTTP 500:', error);
      // Convert HTTP error to regular error
      const errorMessage = error.message || 'Failed to add drive';
      throw Error(errorMessage);
    }
  };

  const onCancel = () => {
    console.debug('Cancel calibration form');
    // params.onCancel()
    router.back();
  };

  const DriveForm = () => {
    form = {
      ...form,
      onChange,
      onCancel,
    };

    return (
      <MyForm
        {...form}
        error={formError}
        // onChange={onChange}
        onChange={(value: any) =>
          onChange(value)
            // .then((response: { data: { id: any; }; }) => {
            // console.log("Go To the drive page: " , response.data.id )
            .then((d: Drive) => {
              console.log('Add drive:', d);
              // navigate(`samples/${response.data.id}`)
              // const path = `/projects/${projectid}/samples/${sampleid}/subsamples/new/${response.data.id}`
              const path = `/drives/`;
              navigate(path);
            })
            // .catch((error: any) => {
            //     console.error("Error adding drive:", error)
            //     // Handle error (e.g., show error message to user)
            // })
            .catch(error => {
              console.debug('4. Error caught:', error);
              console.debug('5. Error details:', {
                message: error.message,
                stack: error.stack,
              });
              setFormError(error.message || error);
              throw error; // Re-throw to propagate
            })
        }
        onCancel={onCancel}
      />
    );
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="text-center justify-center">
          <h1>Drive</h1>
          <DriveForm />
        </div>
      </section>
    </>
  );
};

export default NewDriveForm;
