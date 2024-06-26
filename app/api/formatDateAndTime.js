
export const formatDate = (date /*:string | number | Date */ ) => {
    // console.log("--- date:",date);
    let localdate = "date";
    const locale /*: LocalesArgument*/ = "fr-FR";
    try {
        let dayoptions /* : DateTimeFormatOptions */ = {
            // weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        localdate = new Date(date).toLocaleString(locale, dayoptions);
        // console.log("formatDate date:",localdate);
    } catch (error) {
        console.error(error);
        localdate = "NaN";
    }
    return localdate;
}


export const formatTime = (date /*:string | number | Date */) => {
    // console.log("--- time:",date);
    let localdate = "time";
    const locale /*: LocalesArgument*/ = "fr-FR";
    try {
        localdate = new Date(date).toLocaleTimeString();
        // console.log("formatTime time:",localdate);
    } catch (error) {
        console.error(error);
        localdate = "NaN";
    }
    return localdate;
}

