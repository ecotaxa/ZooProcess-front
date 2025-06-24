
export enum eState {
    metadata = 0,

    scannerSettings , // = 1,
    info , //= 2,

    background,

    // preview , //= 3,
    // thirtys1 = 4,
    scan1 ,//= 5,
    process,// = 6,
    check , //= 7,
    end , //= 8

    // moved to the end, to not generate bugs
    // need to move back when we will use the scanner 
    preview , //= 3,
    thirtys1 = 4,
}


export const timelist = [
    { text: "Metadata", checked: false },
    { text: "Scanner Info", checked: false },
    { text: "Background", checked: false },
    { text: "Prepare", checked: false },
    // { text: "Preview", checked: false },

    { text: "Scan", checked: false },
    { text: "Process", checked: false },
    { text: "Check", checked: false },
];

