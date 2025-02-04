"use client"

import { Check} from "../../new/[subsampleid]/Check";
import { eState } from "../../new/[subsampleid]/state"


const CheckPage = () => {

const params = {
    current : eState.check,
    nextState : eState.end,
    setCurrentFn : () => {} ,
    onCancel : () => {}

}



return (

    <>
    Vignettes
    <Check {...params} />
    </>

)



}


export default CheckPage;