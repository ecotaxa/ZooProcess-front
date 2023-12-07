import {  Card, CardContent, Grid, Typography } from "@mui/material";
// import { FormElements, fraction_inputFormElments, inputFormElements, inputFormElements_tow_type_vertical, sampleid_formElements } from '../services/formElements';
import { useState, useMemo } from "react";
import { FormElements } from "@/components/myFormElements";
import { Button } from "@nextui-org/button";
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
        const v = myform[formitem.name]
        formitem['value']= v
    
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
        return (       
            myJsonForm.map(input => 
                <Grid container 
                  spacing={0} 
                  rowSpacing={0} 
                  border={0} 
                  marginBottom={1} 
                  marginTop={1}
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
                </Grid>
            )
        );
    }

    // Search the type of an element
    const searchtypeof = (name) => { 
        var found = false
        var type = undefined
    
        forms.map((form) => {
          console.log("form",form)
            form.map(group => 
              group.section.map(element => {
                console.log("name:", name , " === " , element.name , "=", element.type)
                if ( element.name == name ) { 
                  console.log("found",name)
                  found = true
                  type = element.type
                  return element.type 
                }    
              })
            )
        });
        return type
    }

    const onChangeElement = (name,value) => {
        console.log("onChange:",name,value)    
        const type = searchtypeof(name)
        console.log("type:",type)
    
        if (type === "number" ) {
          setMyForm({...myform, [name]: Number(value)})
        } else {
          setMyForm({...myform, [name]: value})
        }
    
        console.log("form",myform)
      }

    const reset = () => {
        const data = {}
        const keys = Object.keys(myform);
        console.log(keys)
        keys.forEach(element => {
            data[element]=''
        });
        console.log("data",data)
        setMyForm(data)
        props.onCancel()
    }
    
    const onSubmitHandler = (event /*: React.FormEvent<HTMLFormElement>*/) => {
        event.preventDefault(); // 👈️ prevent page refresh

        console.log("event", event)
        console.log("event.timeStamp", event.timeStamp)
        console.log("submit form", myform)
        props.onChange(myform)
        // setMyForm(props.value?props.value:{})
        reset()
    }  

    // to print the debug json
    const stringifiedData = useMemo(() => JSON.stringify(myform, null, 2), [myform]);

    return (
        // <ThemeProvider theme={theme}>
        // <div className="App">
          <Grid style={{padding: "80px 5px 5px"}}>
            <Card style={{ maxWidth: 800, margin: "0 auto"}}>
              <CardContent>
                <h4
                  color="primary">
                    {title}
                </h4>
                <Typography variant="subtitle1" 
                  color="textSecondary">
                    {subtitle}
                </Typography>
                <form onSubmit={onSubmitHandler}>
                  <Grid key="form">
                    {
                      forms.map( input => formElements(input) )
                    }
    
                    <Grid key="button"
                        item={true} 
                        xs={12} 
                        marginTop={2} 
                        align="right" 
                        margin={2}  
                      >
                      <Button style={margin} key="refill"
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
                      >Submit</Button>
                    </Grid>
    
                  </Grid>
                </form>
    
              </CardContent>
            </Card>
            {/* <Card>
              <Grid item={true} sm={6}>
                <Typography variant={'h4'}>
                  Bound data
                </Typography>
                <div>
                  <pre id='boundData'>{stringifiedData}</pre>
                </div>
              </Grid>
            </Card> */}
          </Grid>
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
