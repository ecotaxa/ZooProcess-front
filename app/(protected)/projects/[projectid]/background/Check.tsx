import { Project } from "@/app/api/network/interfaces"



export function Check (params:{
    project: Project
    taskId?: string
    onCancel:()=>void,
    onValid:()=>void
    }){
    const { onCancel, onValid, project, taskId } = params


    return (
        <>
        <div>
            <h1>Check {taskId}</h1>
        </div>
        </>
    )

}

//default export Check