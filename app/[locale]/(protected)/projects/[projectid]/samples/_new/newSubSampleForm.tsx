import { Project, Sample } from "@/app/api/network/interfaces"
import { FC } from "react"

interface pageProps {
    // params: {
        // projectid: string
        project: Project,
        sample: Sample
    // }
}

// const NewSample : FC<pageProps> = (params) => {
    // const NewSampleForm : FC<pageProps> = ({projectid}) => {
        const NewSubSampleForm : FC<pageProps> = ({project,sample}) => {


            return (
                <>
                    <div>
                        <h1>New Sub Sample</h1>
                    </div>
                </>
            );
        }
    export default NewSubSampleForm;
    