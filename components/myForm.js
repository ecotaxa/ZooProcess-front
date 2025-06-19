"use client"

import {   Grid , Typography} from "@mui/material";

import { useState, 
   useEffect } from "react";
import { FormElements } from "@/components/myFormElements";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader, Spacer } from "@heroui/react";
import { Debug } from "@/components/Debug";
// MyForm
// props.forms must contain a form template or a list of form templates
// props.value can contain form values if need to prefill the form
export function MyForm(props){

  console.debug("#️⃣  MyForm(props): ", props );

  const {forms, value, title, subtitle, error:errorMessage} = props;
  const [fieldErrors, setFieldErrors] = useState(null);

  const button = props.button

  const btn = {
    cancel:button?.cancel||"Cancel",
    submit:button?.submit||"Submit",
    submitting:button?.updating||'Updating...',
  }


  console.log("MyForm : " , forms);

  // keep value to reset it
  let defaultValue = {...props.value}
  console.debug("defaultValue", defaultValue);
 

  const [myValues, setMyValues] = useState(value || defaultValue || {});


  const [isDataModified, setIsDataModified] = useState(false)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDataUpdated, setIsDataUpdated] = useState(false)

  const [values, setValues] = useState(defaultValue?defaultValue:{});

    useEffect(()=>{
      console.debug("⚠️ errorMessage has changed:", errorMessage);

    // Display general errors
    if (errorMessage?.general) {
        // Show general error message
        setError(errorMessage.general)
    }
    
    // Display field-specific errors
    if (errorMessage && typeof errorMessage === 'object') {
        // Map errors to specific form fields
        // This depends on how your MyForm component is structured
        setError(errorMessage.message)
    }


      setIsUpdating(false)
    },[errorMessage])

    useEffect(()=>{
      console.debug("=============> myValues has changed:", myValues);
    },[myValues])




    
    const updateValue = (update, myValues, value) => {
        console.log("updateValue(update)  : ", update );
        console.log("updateValue(myValues): ", myValues );
        console.log("updateValue(value)   : ", value );

        const params = update.params.slice(1).slice(0,-1).split(',')

        let param = {}
        params.forEach(element => {
          console.log("element: ", element);  
            if (  ! element in props ){
                throw (`params error in update. ${element} don't exist`)
            }
            param[element] = myValues[element]
            console.log("myValues[element]: ", myValues[element]);
        });

        const prefix = new Function( update.params, update.func );
        const v = prefix(param)
        return v
    }




    // inject the values given in parameter in the form
    const myElement = (formitem) => {

      if ( ! 'name' in formitem ){
        console.debug("myElement: ", formitem);
        throw ("myElement: formitem must have a name")
      }

      if ( formitem.name ){
        let value = myValues[formitem.name];

        if ( value != undefined ){

            console.debug("FORM VALUE for ", formitem.name, " = " , value , " <= " , formitem['value'] );

          formitem['value'] = value ;
        } else {
          if ( formitem['value'] != undefined) {
            myValues[formitem.name] = formitem['value']
            let form = myValues
            form[formitem.name] = formitem['value'] ;
            setMyValues(form)
          }
        }


        if ( formitem.update ){
          console.debug("formitem.update PRESENT")
          const valueUpdated = updateValue(formitem.update, myValues, value)
          console.debug("FORM VALUE for ", formitem.name, " = " , valueUpdated , " <= " , formitem['value'] );
          formitem['value'] = valueUpdated
          let copiedValues = myValues
          copiedValues[formitem.name] = valueUpdated
        }


      } else {
        console.error("formitem.name is undefined");
        formitem['name']="empty_" + String(Math.floor(Math.random() * 100)) // j'aime pas mais j'ai pas mieux pour le moment
      }

      // injecte les values dans le composant
      formitem['myValues'] = myValues

        return (
            <Grid key={formitem.name}
              xs={formitem.xs}
              sm={formitem.sm}
              item={true}
            >
              <Debug title="" params={formitem.name} open={true}/>
              <FormElements {...formitem} key={formitem.name}
                project={props.project}
                sample={props.sample}
                subsample={props.subsample}
                onChange={(n,v) => onChangeElement(n,v)}
                />
            </Grid>
        )
    }

    const formElements = (myJsonForm=[]) => {

        return (       
          myJsonForm.map(input => 
            <div className="grid"
              key={input.title}
            >
              <Grid xs={12} item
                marginTop={6} 
                marginBottom={2}
                key="title"
              >
                <Typography variant='subtitle1' 
                  align='center' 
                  gutterBottom
                >{input.title}</Typography>
              </Grid>
              <Grid container 
                  spacing={0} 
                  rowSpacing={3} 
                  columnSpacing={1} 
                  xs={12} item
                >
                {input.section.map(item => myElement(item))}
              </Grid>
            </div>
          )
        );
    }

    // Search the type of an element
    const searchtypeof = (name) => { 
        var found = false;
        var type = undefined;
    
        forms.map((form) => {
            form.map(group => 
              group.section.map(element => {
                if ( element.name == name ) { 
                  found = true;
                  type = element.type;
                  return element.type; 
                }    
              })
            )
        });
        return type
    }

    const [valeur, setValeur] = useState({})
    
    useEffect(()=>{
      console.log("valeur has changed:", valeur);
      const name = valeur.name
      const value = valeur.value

      const type = searchtypeof(name);
      console.log("type:", type);  
      console.log("onChangeElement myValues", myValues);

      if (type === "number" ) {
        const newForm = {...myValues, [name]: Number(value)};
        setMyValues({...newForm});
      } else {
        const newForm = {...myValues, [name]: value};
        console.log("newForm", newForm);
        setMyValues({...newForm});
      }
      setIsDataModified(true)
      setIsDataUpdated(false)
      console.log("onChangeElement form values", myValues);
    },[valeur])

  // Add deep comparison function
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

  const hasChanges = () => {
    return JSON.stringify(myValues) !== JSON.stringify(defaultValue);
};

  // Update useEffect for value changes
  useEffect(() => {
      if (!isEqual(myValues, defaultValue)) {
          setIsDataModified(true);
      }
  }, [myValues]);


    const findElement = (name) => { 
  
      return forms.flatMap((form) => {
          console.log("form",form);
          return form.flatMap(group => 
            group.section.filter(element => {
              if ( element.name == name ) { 
                console.log("found", name);
              return true
              }
              return false
            })
          )
      })[0];
  }

    const onChangeElement = (name, value) => {
        console.log("onChangeElement before setValeur :", name, "-- value: ", value);
        setValeur({name:name, value:value})
        console.log("onChangeElement myValues", myValues);

        setIsUpdating(false); // Reset updating state
        const updatedValues = {...myValues, [name]: value};
        const isChanged = JSON.stringify(updatedValues) !== JSON.stringify(defaultValue);
        setIsDataModified(isChanged);
      }



    const cancel = () => {
      console.debug("cancel()");
        setMyValues(defaultValue)
        props.onCancel();
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsUpdating(true);
        
        try {
            const response = await props.onChange(myValues);
            setValues(response);
            defaultValue = response;
            setIsDataUpdated(true);
            setIsDataModified(false);
            setError(null);
            setFieldErrors(null); // Clear field errors on success
        } catch (error) {
            // Check if it's a validation error with detailed field errors
            if (error.fieldErrors) {
                setFieldErrors(error.fieldErrors);
                setError(error.message || "Please check the form fields.");
            } else {
                setError(error.message || error);
                setFieldErrors(null);
            }
            setIsDataModified(true);
        } finally {
            setIsUpdating(false);
        }
  }

    return (
      <form onSubmit={onSubmitHandler}>
        <Card>
          <CardHeader className="flex flex-col">
            <h1
              color="primary">
                {title}
            </h1>
            <h4 variant="subtitle1" 
              color="textSecondary">
                {subtitle}
            </h4>
          
          {/* 
          <Debug params={forms} title="forms"/>
          <Debug params={value} title="value"/>
          <Debug params={myValues} title="myValues" open={true}/>
          <Debug params={error} title="error" open={true}/>
          <Debug params={errorMessage} title="errorMessage" open={true}/> 
          */}

          </CardHeader>
          <CardBody>

              <div className="grid" key="form">
                {
                  forms.map( input => formElements(input) )
                }

              </div>


          </CardBody>
          <CardFooter>
          <div className="gridjustify-items-end"
                  >
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {isDataUpdated && <div>Data have been updated</div>}

                    <div className="flex flex-row-reverse">
                  <Button 
                    type="submit" 
                    variant="solid" 
                    color="primary"

                    isDisabled={!isDataModified}


                  >
                    {isUpdating ? btn.submitting : btn.submit }
                  </Button>
                  <Spacer x={2}/>

                  <Button
                    type="reset" 
                    variant="flat" 
                    color="primary" 
                    onClick={cancel}
                  >{btn.cancel}</Button>
 
                  <Spacer x={2}/>

 
                  </div>

 
                </div>
          </CardFooter>
        </Card>
      </form>
    );
}

