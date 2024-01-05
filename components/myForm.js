"use client"

// import {  Card, CardContent, Grid, Typography } from "@mui/material";
import {   Grid , Typography} from "@mui/material";

// import { FormElements, fraction_inputFormElments, inputFormElements, inputFormElements_tow_type_vertical, sampleid_formElements } from '../services/formElements';
import { useState, useMemo, useEffect } from "react";
import { FormElements } from "@/components/myFormElements";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";
import { Debug } from "@/Components/Debug";

// import { Debug } from "@/components/Debug";

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

// MyForm
// props.forms must contain a form template or a list of form templates
// props.value can contain form values if need to prefill the form
export function MyForm(props){
// const Page = () => {

    // const router = useRouter()
    // const props = router.query.props //as string

    // const props = 

    // const forms = [
    //     sampleid_formElements, 
    //     inputFormElements, 
    //     inputFormElements_tow_type_vertical, 
    //     fraction_inputFormElments
    //   ]      
    // const forms = props.forms;
    // const {forms,onChange,onCancel} = props;
    const {forms,value,title,subtitle} = props;

    const button = props.button

    const btn = {
      cancel:button?.cancel||"Cancel",
      submit:button?.submit||"Submit",
      submitting:button?.updating||'Updating...',
    }

    console.log("MyForm(props): ", props );

    console.log("MyForm : " , forms);
    // const [myform, setMyForm] = useState({});
    // setMyForm(props.value)

    // keep value to reset it
    let defaultValue = {...props.value}

    // const testData2 = {sample_id:'b', scientific_program:'dyfamed_wp2_2023_biotom_sn001', latitude_ns:2}
    // const [myform, setMyForm] = useState(props.value?props.value:{});
    const [myValues, setMyForm] = useState(props.value || {});
    // const [myform, setMyForm] = useState({});
    // setMyForm(testData2)
    // const [title, setTitle] = useState(props.title?props.title:"Title");
    // const [subtitle, setSubTitle] = useState(props.subtitle?props.subtitle:"subTitle");

    // const [isLoading, setIsLoading] = useState<boolean>(false)
    // const [error, setError] = useState<string | null>(null)

    // const [defaultValue,setDefaultValue] = useState(props.value)
    const [isDataModified, setIsDataModified] = useState(false)
    const [error, setError] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDataUpdated, setIsDataUpdated] = useState(false)

    const [values, setValues] = useState(defaultValue?defaultValue:{});
    // const [values, setValues] = useState(props.value || {});


    useEffect(()=>{
      console.log("myForm has change:", myValues);
      setValues(myValues)

    },[myValues])

    const margin={margin:"0 5px"}

    const init = () => {
        setMyForm(defaultValue)
    }

    // inject the values given in parameter in the form
    const myElement = (formitem) => {

      if ( formitem.name ){
        const value = myValues[formitem.name];

        // console.log("FORM VALUE for ", formitem.name, " = " , value , " <=> " , formitem['value'] );

        if ( value != undefined ){
          formitem['value'] = value;
        } else {
          // console.log("UNDEFINED");
          if ( formitem['value'] != undefined) {
            // console.log("OVERRIDE")
            myValues[formitem.name] = formitem['value']
            let form = myValues
            form[formitem.name] = formitem['value']
            setMyForm(form)
          }
        }
      } else {
        formitem['name']="empty_"+String(Math.floor(Math.random() * 100)) // j'aime pas mais j'ai pas mieux pour le moment
      }
        // console.log("-+-+-+---------------------------------");
        // console.log("myform: ", myform);
        // console.log("formitem: ", formitem);
        // console.log("-+-+-+---------------------------------");

        return (
            <Grid key={formitem.name}
              xs={formitem.xs} 
              sm={formitem.sm} 
              item={true}
            >
              <FormElements {...formitem} key={formitem.name}
                project={props.project}
                onChange={onChangeElement}
              />
            </Grid>
        )
    }

    const formElements = (myJsonForm=[]) => {
      // console.log("formElements: ", myJsonForm);

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
          // console.log("form",form);
            form.map(group => 
              group.section.map(element => {
                // console.log("name:", name , " === " , element.name , "=", element.type);
                if ( element.name == name ) { 
                  // console.log("found",name);
                  found = true;
                  type = element.type;
                  return element.type; 
                }    
              })
            )
        });
        return type
    }

    const onChangeElement = (name,value) => {
        console.log("onChangeElement:",name, "-- value: ", value);
        const type = searchtypeof(name);
        console.log("type:",type);
    
        if (type === "number" ) {
          const newForm = {...myValues, [name]: Number(value)};
          // setMyForm({...myform, [name]: Number(value)});
          // const nform = { ...form
          setMyForm({...newForm});
        } else {
          const newForm = {...myValues, [name]: value};
          setMyForm({...newForm});
          // setMyForm({...myform, name: value});
          
        }
        setIsDataModified(true)
        setIsDataUpdated(false)
        console.log("onChangeElement form values", myValues);
      }

    const cancel = () => {
        // const data = {};
        // const keys = Object.keys(myValues);
        // console.log(keys)
        // keys.forEach(element => {
        //     data[element]=''
        // });
        // console.log("data", data)
        // setMyForm(data);
        setMyForm(defaultValue)
        props.onCancel();
    }
    
  const onSubmitHandler = async (event /*: React.FormEvent<HTMLFormElement>*/) => {
        event.preventDefault(); // 👈️ prevent page refresh
        setIsDataModified(false) // Set loading to true when the request starts
        setError(null) // Clear previous errors when a new request starts

        const formData = new FormData(event.currentTarget)
        console.log("formData: ",formData)


        console.log("onSubmitHandler event", event);
        console.log("event.timeStamp", event.timeStamp);
        console.log("onSubmitHandler submit form", myValues);
        console.log("onChange(", values);
        
        setIsUpdating(true)
        props.onChange(values)
        .then( (response) => {
          console.log("onChange OK");
          console.log(response);
          // console.log("Data Updated")
          defaultValue = values;
          setIsDataUpdated(true)
          setIsUpdating(false)
        })
        .catch( (error) => {
          const message = error
          console.error("onChange Error", message);
          setIsUpdating(false)
          setIsDataModified(true)
          setError(message)
          // console.error(error)
        })

    }  

    // to print the debug json
    // const stringifiedData = useMemo(() => JSON.stringify(myform, null, 2), [myform]);

    return (
        // <ThemeProvider theme={theme}>
        // <div className="App">
          // <div className="grid">

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
              
              <Debug params={forms} title="forms"/>
              <Debug params={myValues} title="value"/>
              {/* <Debug params={myValues} title="myform"/> */}

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
                        // onClick={props.onChange}

                        isDisabled={!isDataModified}
                      >
                        {isUpdating ? btn.updating : btn.submit }
                      </Button>
                      <Spacer x={2}/>

                      <Button
                        type="reset" 
                        variant="flat" 
                        color="primary" 
                        onClick={cancel}
                      >{btn.cancel}</Button>
     
                      <Spacer x={2}/>

                      {/* <Button
                        type="reset" 
                        variant="faded" 
                        color="primary" 
                        onClick={init}
                      >Refill</Button> */}
                      </div>

                      {/* <Button style={margin} key="refill"
                        type="reset" 
                        variant="outlined" 
                        color="primary" 
                        onClick={init}
                      >Refill</Button>
                      <Button style={margin}  key="reset"
                        type="reset" 
                        variant="outlined" 
                        color="primary" 
                        onClick={reset}
                      >Cancel</Button>
                      <Button type="submit"  key="submit"
                        variant="contained" 
                        color="primary"
                      >Submit</Button> */}
                    </div>
              </CardFooter>
            </Card>
            </form>
    
    
 
 
          // </div>
        // </div>
        // </ThemeProvider>
        );
}


// Page.getLayout = (page) => (
//     <DashboardLayout>
//       {page}
//     </DashboardLayout>
//   );


// export async function getStaticPaths() {
//     // Return a list of possible value for id
//     return [1,2]
// }

// export async function getStaticProps({ params }) {
//     // Fetch necessary data for the blog post using params.id
//     const samples = {
        
//     }
//     return sample
// }

// export default Page;
