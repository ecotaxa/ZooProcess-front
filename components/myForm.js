// import {  Card, CardContent, Grid, Typography } from "@mui/material";
import {   Grid , Typography} from "@mui/material";

// import { FormElements, fraction_inputFormElments, inputFormElements, inputFormElements_tow_type_vertical, sampleid_formElements } from '../services/formElements';
import { useState, useMemo } from "react";
import { FormElements } from "@/components/myFormElements";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";

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
    const {forms} = props;


    // console.log("MyForm : " , forms);
    // const [myform, setMyForm] = useState({});
    // setMyForm(props.value)

    // keep value to reset it
    const defaultValue = props.value

    // const testData2 = {sample_id:'b', scientific_program:'dyfamed_wp2_2023_biotom_sn001', latitude_ns:2}
    const [myform, setMyForm] = useState(props.value?props.value:{});
    // setMyForm(testData2)
    const [title, setTitle] = useState(props.title?props.title:"Title");
    const [subtitle, setSubTitle] = useState(props.subtitle?props.subtitle:"subTitle");

    const margin={margin:"0 5px"}

    const init = () => {
        setMyForm(defaultValue)
    }

    // inject the values given in parameter in the form
    const myElement = (formitem) => {
        const value = myform[formitem.name];

        // console.log("FORM VALUE for ", formitem.name, " = " , value , " <=> " , formitem['value'] );

        if ( value != undefined ){
          formitem['value'] = value;
        } else {
          // console.log("UNDEFINED");
          if ( formitem['value'] != undefined) {
            // console.log("OVERRIDE")
            myform[formitem.name] = formitem['value']
            let form = myform
            form[formitem.name] = formitem['value']
            setMyForm(form)
          }
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
              <FormElements {...formitem} 
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
          setMyForm({...myform, [name]: Number(value)});
        } else {
          setMyForm({...myform, [name]: value});
        }
        console.log("onChangeElement form values", myform);
      }

    const reset = () => {
        const data = {};
        const keys = Object.keys(myform);
        // console.log(keys)
        keys.forEach(element => {
            data[element]=''
        });
        // console.log("data", data)
        setMyForm(data);
        props.onCancel();
    }
    
    const onSubmitHandler = (event /*: React.FormEvent<HTMLFormElement>*/) => {
        event.preventDefault(); // 👈️ prevent page refresh

        console.log("onSubmitHandler event", event);
        console.log("event.timeStamp", event.timeStamp);
        console.log("onSubmitHandler submit form", myform);
        props.onChange(myform);
        // setMyForm(props.value?props.value:{})
        reset();
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
                        <div className="flex flex-row-reverse">
                      <Button 
                        type="submit" 
                        variant="solid" 
                        color="primary"
                      >Submit</Button>
                      <Spacer x={2}/>

                      <Button
                        type="reset" 
                        variant="flat" 
                        color="primary" 
                        onClick={reset}
                      >Cancel</Button>
     
                      <Spacer x={2}/>

                      <Button
                        type="reset" 
                        variant="faded" 
                        color="primary" 
                        onClick={init}
                      >Refill</Button>
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
