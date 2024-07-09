"use client"

// import {  Card, CardContent, Grid, Typography } from "@mui/material";
import {   Grid , Typography} from "@mui/material";

// import { FormElements, fraction_inputFormElments, inputFormElements, inputFormElements_tow_type_vertical, sampleid_formElements } from '../services/formElements';
import { useState, useMemo, useEffect } from "react";
import { FormElements } from "@/components/myFormElements";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";
import { Debug } from "@/components/Debug";
// import { el } from "date-fns/locale";

// import { Debug } from "@/components/Debug";

// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

// MyForm
// props.forms must contain a form template or a list of form templates
// props.value can contain form values if need to prefill the form
export function MyForm(props){

  console.debug("AAAAAARRRRRRRGGGGGGG  MyForm(props): ", props );

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
    const {forms, value, title, subtitle} = props;

    const button = props.button

    const btn = {
      cancel:button?.cancel||"Cancel",
      submit:button?.submit||"Submit",
      submitting:button?.updating||'Updating...',
    }

    

    console.log("-----------> MyForm(props): ", props );

    console.log("MyForm : " , forms);
    // const [myform, setMyForm] = useState({});
    // setMyForm(props.value)

    // keep value to reset it
    let defaultValue = {...props.value}

 

    // const testData2 = {sample_id:'b', scientific_program:'dyfamed_wp2_2023_biotom_sn001', latitude_ns:2}
    // const [myform, setMyForm] = useState(props.value?props.value:{});
    const [myValues, setMyValues] = useState(value || {});
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

    // const [rand,setRand] = useState(Math.random())

    useEffect(()=>{
      console.log("myValues has changed:", myValues);
      // setRand(Math.random())
      // console.log("rand", rand);
    //   setValues(myValues)

    },[myValues])
    // },[props.value])

    // const margin={margin:"0 5px"}

    const init = () => {
        setMyValues(defaultValue)
    }

    const updateValue = (update, myValues, value) => {
      //if (props.fn2) {
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

        const prefix = new Function( update.params , update.func );
        // opt['prefix'] = prefix(param)  // mui/material ?
        // opt['startContent'] = prefix(param) // NextUI
        const v = prefix(param)
        return v
      //}
    }


    // inject the values given in parameter in the form
    const myElement = (formitem) => {
      // console.debug("myElement: ", formitem);

      if ( formitem.name ){
        let value = myValues[formitem.name];

        // setRand(Math.random())
        // if ( value !== formitem['value'] ){
          // console.debug("FORM VALUE for ", formitem.name, " = " , value , " <= " , formitem['value'] );

        if ( value != undefined ){

        // const c = { update: {
        //     params:"{fraction_number,fraction_id_suffix}",
        //      func:'return String(fraction_number)+"_"+String(fraction_id_suffix)'
        // }}

          // if ( formitem.update ){
          //   console.debug("formitem.update PRESENT")
          //   const opts = updateValue(formitem.update, myValues, value)
          //   console.debug("opts: ", opts);
          //   console.debug("FORM VALUE for ", formitem.name, " = " , value , " <= " , formitem['value'] );
          // }
        //   else {
            // console.log("NO UPDATE fn");
            // value = formitem['value']
          // }

          formitem['value'] = value ;
        } else {
          // console.log("UNDEFINED");
          if ( formitem['value'] != undefined) {
            // console.log("OVERRIDE")
            myValues[formitem.name] = formitem['value']
            let form = myValues
            form[formitem.name] = formitem['value'] ;
            setMyValues(form)
          }
        }


        // if ( formitem.update ){
        //   console.debug("formitem.update PRESENT")
        //   const valueUpdated = updateValue(formitem.update, myValues, value)
        //   // console.debug("opts: ", opts);
        //   console.debug("FORM VALUE for ", formitem.name, " = " , valueUpdated , " <= " , formitem['value'] );
        //   formitem['value'] = valueUpdated
        //   // formitem['onChange'](valueUpdated)
        //   // props.onChangeElement(formitem.name,valueUpdated)
        //   let copiedValues = myValues
        //   copiedValues[formitem.name] = valueUpdated
        //   setMyValues(copiedValues)
        // }


      } else {
        console.error("formitem.name is undefined");
        formitem['name']="empty_" + String(Math.floor(Math.random() * 100)) // j'aime pas mais j'ai pas mieux pour le moment
        //throw ("formitem.name is undefined: ", formitem )
      }

      // injecte les values dans le composant
      formitem['myValues'] = myValues

      // console.log("-+-+-+---------------------------------");
      // // console.log("myform: ", myform);
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
                sample={props.sample}
                subsample={props.subsample}
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

    // setRand(Math.random())

    const [valeur,setValeur] = useState({})
    
    useEffect(()=>{
      console.log("valeur has changed:", valeur);
      //setValues(valeur)

      const name = valeur.name
      const value = valeur.value

      const type = searchtypeof(name);
      console.log("type:",type);
  
      console.log("onChangeElement myValues", myValues);
      // console.log("onChangeElement rand", rand);

      if (type === "number" ) {
        const newForm = {...myValues, [name]: Number(value)};
        // setMyForm({...myform, [name]: Number(value)});
        // const nform = { ...form
        setMyValues({...newForm});
      } else {
        const newForm = {...myValues, [name]: value};
        console.log("newForm",newForm);
        setMyValues({...newForm});
        // setMyForm({...myform, name: value});
        
      }
      setIsDataModified(true)
      setIsDataUpdated(false)
      console.log("onChangeElement form values", myValues);

    },[valeur])



    const findElement = (name) => { 
      // var found = false;
      // var type = undefined;
  
      return forms.flatMap((form) => {
          console.log("form",form);
          return form.flatMap(group => 
            group.section.filter(element => {
              // console.log("name:", name , " === " , element.name , "=", element.type);
              if ( element.name == name ) { 
                console.log("found", name);
              //   // found = true;
              //   // type = element.type;
              //   // return element.type; 
              //   return element;
              return true
              }
              // element.name == name
              return false
            })
          )
      })[0];
      // return type
  }

    const onChangeElement = (name, value) => {
        console.log("onChangeElement:", name, "-- value: ", value);

        setValeur({name:name, value:value})
        
        // const type = searchtypeof(name);
        // console.log("type:",type);
    
        // console.log("onChangeElement myValues", myValues);
        // // console.log("onChangeElement rand", rand);

        // if (type === "number" ) {
        //   const newForm = {...myValues, [name]: Number(value)};
        //   // setMyForm({...myform, [name]: Number(value)});
        //   // const nform = { ...form
        //   setMyValues({...newForm});
        // } else {
        //   const newForm = {...myValues, [name]: value};
        //   console.log("newForm",newForm);
        //   setMyValues({...newForm});
        //   // setMyForm({...myform, name: value});
          
        // }
        // setIsDataModified(true)
        // setIsDataUpdated(false)
        // console.log("onChangeElement form values", myValues);



  

        const element = findElement(name)
        if (element){
          console.log("element", element);
          if ( element.refresh ) {
            console.debug("element.refresh PRESENT")
            // elementToRefresh = element.refresh
            console.log("element To Refresh", element.refresh);
            refresh(element.refresh)
          }
          // refresh(element)
          //update(element)
        }
        else {
          console.log("element not found", name)
        } 

        // const elements = forms.filter( (form) => form.name == name)
        // elements.map( (element) => {
        //   if (element.refresh) {
        //     forms.map( (element) => {
        //     console.log("element",element);
        //     update(element)
        //     }
        //   }
        // })

      }

      const refresh = (elementName) => {
        // if ( formitem.refresh ) {
          // console.debug("formitem.refresh PRESENT")
          // elementToRefresh = element.refresh
          console.log("refresh(", elementName, ")");
          const element = findElement(elementName)
          if (element.update){
            update(element)
          }
      }

      const update = (formitem) => {
        if ( formitem.update ) {
          console.debug("Element to update PRESENT")
          const valueUpdated = updateValue(formitem.update, myValues, value)
          // console.debug("opts: ", opts);
          console.debug("FORM VALUE for ", formitem.name, " = " , valueUpdated , " <= " , formitem['value'] );
          formitem['value'] = valueUpdated
          // formitem['onChange'](valueUpdated)
          // props.onChangeElement(formitem.name,valueUpdated)
          let copiedValues = myValues
          // copiedValues[formitem.name] = valueUpdated
          // setMyValues(copiedValues)
          setValeur({ name: formitem.name, value: valueUpdated })
        }

      }


    //   const findElement = (name) => { 
    //     // var found = false;
    //     var type = undefined;
    //     console.debug("findElement(", name,")");
    
    //     const element = forms.flatMap((form) => {
    //       console.log("form", form);
    //         form.flatMap(group => 
    //         //   group.section.flatMap(element => {
    //         //     console.log("name:", name , " === " , element.name , "=", element.type);
    //         //     if ( element.name == name ) { 
    //         //       console.log("found",name);
    //         //       //found = true;
    //         //       //type = element.type;
    //         //       return element
    //         //     }    
    //         //   })
    //         // )
    //         group.section.filter(element => { element.name == name })
    //       )
    //     });
    //     console.log("element", element);
    //     if ( element ) {
    //       return element[0]
    //     }
    //     console.log("findElement not found",name);
    //     return undefined
    // }



      // const findElement = (name/*:string*/) => {
      //   console.debug("findElement(", name,")");
      //   console.debug("forms",forms);

      //   const elements = forms.flatMap( (form) => {
      //     console.debug("chapter",form);
      //     return form.flatMap
      //     return form.filter( (element) => {
      //         console.debug("element", element);
      //         return element.name == name
      //       }
      //     )
      //   })


      //   return  elements[0]
      // }

    const cancel = () => {
      console.debug("cancel()");
        // const data = {};
        // const keys = Object.keys(myValues);
        // console.log(keys)
        // keys.forEach(element => {
        //     data[element]=''
        // });
        // console.log("data", data)
        // setMyForm(data);
        setMyValues(defaultValue)
        props.onCancel();
    }
    
  const onSubmitHandler = async (event /*: React.FormEvent<HTMLFormElement>*/) => {
        console.debug("onSubmitHandler");
        event.preventDefault(); // 👈️ prevent page refresh
        setIsDataModified(false) // Set loading to true when the request starts
        setError(null) // Clear previous errors when a new request starts

        const formData = new FormData(event.currentTarget)
        console.log("formData: ", formData)


        console.log("onSubmitHandler event", event);
        console.log("event.timeStamp", event.timeStamp);
        console.log("onSubmitHandler submit form", myValues);
        console.log("onChange(", values);
        
        setIsUpdating(true)
        // props.onChange(values)
        props.onChange(myValues)
        .then( (response) => {
          // console.log("onChange OK");
          console.log("onChange OK " , response);
          // console.log("Data Updated")
          setValues(response)
          // defaultValue = values;
          defaultValue = response;
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
              <Debug params={value} title="value"/>
              <Debug params={myValues} title="myValues"/>
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
