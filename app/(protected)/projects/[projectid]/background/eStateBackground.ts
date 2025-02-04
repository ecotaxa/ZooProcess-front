
export enum eState {
    // metadata = 0,
    scannerSettings = 0, // = 1,
    info , //= 2,
    preview , //= 3,
    scan1 ,//= 5,
    thirtys1 , //= 4,
    scan2 ,//= 5,
    process,// = 6,
    check , //= 7,
    end , //= 8
}

export const timelist = [
    // { text: "Metadata", checked: false },
    { text: "Scanner Info", checked: false },
    { text: "Prepare", checked: false },
    { text: "Preview", checked: false },
    { text: "Scan", checked: false },
    { text: "30s", checked: false },
    { text: "Scan", checked: false },
    { text: "Process", checked: false },
    { text: "Check", checked: false },
];