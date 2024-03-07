export default function Custom404() {
    return (
        <div>
             <img src="/static/images/404.jpg" alt="404" />
             <h1>404 - Page not found</h1>
        </div>
        // le code dessous ne fonctionne pas :mad: image not found
        // <div className="flex flex-col items-center justify-center h-screen">
        //     <img src="/static/images/404.jpg" alt="404" />
        //     <div className="text-center">
        //         <h1>404 - Page not found</h1>
        //         {/* <p>Could not find requested resource</p> */}
        //         <Link href="/">Return Home</Link>
        //     </div>
        // </div>
    )
}