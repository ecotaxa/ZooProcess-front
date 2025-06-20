
export const sampleid_formElements=[
    {
        title:"Sample ID",
        section:
        [
            { tag:"TextField", name:"project", 
            placeholder:"Project", label:'Project',
                variant:"outlined", disabled:true, 
                xs:12, sm:12, size:"regular", fullWidth:true,
                value:'dyfamed_wp2_2023_biotom_sn001'
            },
            { tag:"TextField", name:"sample_id", type:"text",
                placeholder:"Enter Sample ID, (no extension or space character allowed)", label:'Sample ID',
                variant:"outlined", required:true, 
                xs:12, sm:12, size:"regular", fullWidth:true,
                helperText:"no extension or space character allowed",
                regex:"^[a-zA-Z0-9_]+$", error:true
            }
        ]
    }
    ]

    export const inputFormElementsMapTest=[
    {
        title:"Map Test",
        section:
        [
            { tag:"Map", name:"Map", type:"object",
                placeholder:"map", label:'map',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
                // minValue:0,maxValue:90,
                // endAdornment:{pos:'end', text:'deg'},
                // helperText:"de 0 à 90°",
                object: {
                    start: {
                        lat: 'number',
                        lng: 'number'
                    },
                    end: {
                        lat: 'number',
                        lng: 'number'
                    }
                }
            }
        ]
    }]


    export const inputFormElements=[
    {

        title:"General",
        section:
        [
            { tag:"TextField", name:"sample_id", type:"text",
                placeholder:"Sample id", label:'Sample id',
                variant:"outlined", required:true, 
                xs:12, sm:12, fullWidth:true, size:"regular",
                minLength:3,
                // params:"{projectId}",
                // fn: (params) => {
                //     return {prefix:String(params.project)+"_"}
                // },
                fn2: { params:"{project}", func:'return String(project)+"_"' }
            },
            { tag:"Empty", xs:0, sm:6 },
            { tag:"TextField", name:"barcode", type:"text",
                placeholder:"Barcode", label:'Barcode',
                variant:"outlined", required:false, 
                xs:12, sm:6, fullWidth:true, size:"regular",
                minLength:3
            },
            { tag:"TextField", name:"scientific_program", type:"text",
                placeholder:"Scientific Program", label:'Scientific Program',
                value:"ZooProcess",
                variant:"outlined", required:true, disabled:true,
                xs:12, sm:6, fullWidth:true, size:"regular",
                minLength:3
            },
            { tag:"TextField", name:"station_id", type:"text",
                placeholder:"Station Id", label:'Station Id',
                variant:"outlined", required:true, 
                xs:12, sm:6, fullWidth:true,
                minLength:3
            },
            { tag:"TextField", name:"bottom_depth", type:"number", 
                placeholder:"Bottom depth (m)", label:'Bottom depth',
                variant:"outlined", required:true, 
                xs:12, sm:6, fullWidth:true,
                minValue:0, helperText:'value greater than zero',
                endAdornment:{pos:'end', text:'m'},
            },
            { tag:"DateField", name:"sampling_date", type:"date", 
                placeholder:"Enter Sampling Date", label:'Sampling Date', 
                variant:"outlined", shrink: true, required:true,
                fullWidth:true, xs:12, sm:6
            }
        ]
    },
    {
        title:"Sample Quality",
        section:
        [
            { tag:"TextField", name:"ctd_reference", type:"text",
                placeholder:"CTD Reference", label:'CTD Reference',
                variant:"outlined", required:false, 
                xs:12, sm:6, fullWidth:true,
                minLength:3
            },
            { tag:"TextField", name:"other_reference", type:"text",
                placeholder:"Other reference", label:'Other reference',
                variant:"outlined", required:false, 
                xs:12, sm:6, fullWidth:true,
                minLength:3
            },        
        ],
    },
    {
        title:"Latitude & Longitude",
        section:[ 
    
        // { tag:"TextField",name:"Latitude_degree", type:"number", 
        //     placeholder:"Enter Latitude (degree)", label:'Latitude (degree)',
        //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
        //     minValue:0,maxValue:90, 
        //     endAdornment:{pos:'end', text:'deg'},
        //     helperText:"de 0 à 90°"
        // },
        // { tag:"TextField", name:"latitude_minute", type:"number",
        //     placeholder:"Enter Latitude (minute)", label:'Latitude (minute',
        //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
        //     minValue:0,maxValue:60, helperText:"de 0 à 59",
        //     endAdornment:{pos:'end', text:'min'}
        // },
        // { tag:"Select", name:"latitude_ns", type:"select", 
        //     placeholder:"N/S", label:'Latitude (N/S)',
        //     variant:"outlined", required:true,
        //     fullWidth:true, xs:12, 
        //     sm:3, 
        //     // sm:12, // to debug easely
        //     sx:{m:0, minWith:150},
        //     choice:[
        //         {id:1, value:"North"},
        //         {id:2, value:"South"}
        //     ]
        // },
        // { tag:"TextField",name:"longitude_degree", type:"number", 
        //     placeholder:"Enter Longitude (degree)", label:'Longitude (degree)',
        //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
        //     minValue:0,maxValue:180, helperText:"de 0 à 180°",
        //     endAdornment:{pos:'end', text:'°'}
        // },
        // { tag:"TextField",name:"longitude_minute", type:"number", 
        //     placeholder:"Enter Longitude (minute)" , label:'Longitude (minute)',
        //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
        //     minValue:0,maxValue:59.999999, helperText:"de 0 à 59",
        //     endAdornment:{pos:'end', text:"'"},
        //     // value:59
        // },
        // { tag:"Select",name:"longitude_ew", type:"select", 
        //     placeholder:"E/O", label:'Longitude (N/S)',
        //     variant:"outlined", fullWidth:true, required:true, 
        //     xs:12, sm:3, sx:{m:0, minWith:150},
        //     choice:[
        //         {id:1, value:"East"},
        //         {id:2, value:"West"}
        //     ]
        // },
        { tag:"Map", name:"map", type:"object",
            placeholder:"map", label:'map',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
            // minValue:0,maxValue:90,
            // endAdornment:{pos:'end', text:'deg'},
            // helperText:"de 0 à 90°",
            object: {
                start: {

                    lat: 'number', // 'latitude_start'
                    lng: 'number'   // 'longitude_start'
                },
                end: {
                    lat: 'number', // 'latitude_end'
                    lng: 'number' // 'longitude_end'
                }
            }
        }
    ]
    },
    {
        title:"Tow / Net",
        section:[ 
            { tag:"Select", name:"tow_type", type:"select", 
                placeholder:"Choose Tow type", label:'Tow type',
                variant:"outlined", required:true, 
                fullWidth:true, xs:12, sm:12, sx:{m:0, minWith:150},
                choice:[
                    {id:1, value:"Oblique"},
                    {id:2, value:"Horizontal"},
                    {id:3, value:"Vertical"},
                    {id:4, value:"Other sampling method"}
                ]
            },
            { tag:"TextField", name:"net_sampling_type", 
                placeholder:"WP2, JB, Regent, Omori, Multinet...", label:'Net sampling type',
                variant:"outlined", fullWidth:true, required:true, 
                xs:12, sm:12
            },
            { tag:"TextField", name:"net_mesh", type:"number", 
                placeholder:"Enter Net mesh (µm)", label:'Net mesh',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:12,
                endAdornment:{pos:'end', text:'µm'},
                minValue:0, helperText:'value greather than zero',
            },
            { tag:"TextField", name:"net_opening_surface", type:"number", 
                placeholder:"Enter Net opening surface (m²)", label:'Net opening surface',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:12, 
                endAdornment:{pos:'end', text:'m²'},
                minValue:0, helperText:'value greather than zero',
            },
        ]
    },
    {
        title:"Measurement",
        section:[ 
            { tag:"TextField", name:"maximum_depth", type:"number", 
                placeholder:"Enter Maximun depth (m)", label:'Maximun depth',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:6, 
                endAdornment:{pos:'end', text:'m'},
                minValue:0, helperText:'value greather than zero',
            },
            { tag:"TextField", name:"minimum_depth", type:"number", 
                placeholder:"Enter Minimum depth (m)", label:'Minimum depth',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:6, 
                endAdornment:{pos:'end', text:'m'},
                minValue:0, helperText:'value greather than zero',
            },
            { tag:"Select", type:'select', name:"quality_flag_for_depth_measurement", 
                placeholder:"Choose Quality depth measurement", label:'Quality flag for depth measurement of the net',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:12,
                choice:[
                    {id:1, value:"MEASURED by a depth sensor"},
                    {id:2, value:"CALCULATED from cable length and angle"},
                    {id:3, value:"ESTIMATED from cable length"}
                ]
            },
            { tag:"TextField", name:"ship_name", type:"text",
                placeholder:"Enter Ship name", label:'Ship Name',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:6, 
            },
            { tag:"TextField", name:"ship_speed", type:"number",
                placeholder:"Enter Ship speed (knots) - 9999 if not documented", label:'Ship Speed',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:6, 
                endAdornment:{pos:'end', text:'knots'},
                minValue:0, helperText:'value greather than zero'
            },
            { tag:"TextField", name:"cable_speed", type:"number", 
                placeholder:"Enter Net sampling type - 9999 if not documented", label:'Cable speed',
                variant:"outlined", required:true, 
                xs:12, sm:6, fullWidth:true,
                endAdornment:{pos:'end', text:'m/s'},
                minValue:0, helperText:'value greather than or equal to zero'
            },
            { tag:"TextField", name:"cable_angle_from_vertical", type:"number", 
                placeholder:"Enter Net sampling type - 9999 if not documented", label:'Cable angle from verticale',
                variant:"outlined", fullWidth:true, required:true,
                xs:12, sm:6,
                minValue:0, helperText:'value greather than zero',
            },
            { tag:"TextField", name:"cable_length",  type:"number", 
                placeholder:"Enter cable length - 9999 if not documented", label:'Cable length',
                variant:"outlined", fullWidth:true, required:true, xs:12, sm:6, 
                endAdornment:{pos:'end', text:'m'},
                minValue:0, helperText:'value greather than zero',
            },
            { tag:"TextField", name:"sampling_duration", type:"number", 
                placeholder:"Enter sampling duration (minutes) - 9999 if not documented", label:'Sampling duration',
                variant:"outlined", required:true, 
                xs:12, sm:12, fullWidth:true,
                endAdornment:{pos:'end', text:'min'},
                minValue:0, helperText:'value greather than zero',
            }   
        ]
    }
    ]
    
    export const inputFormElements_tow_type_vertical=[
    {
        title:"The tow type",
        subTiltle:'The towtype is "Vertical". The starting latitude and longitude are utilised.',
        section:
        [
        { tag:"TextField", name:"ending_latitude_degree", type:"number", 
            placeholder:"Enter Ending Latitude (degree)", label:'Latitude (degree)',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:4.5,
            minValue:0, maxValue:90, helperText:"de 0 à 90°",
            endAdornment:{pos:'end', text:'deg'},
        },
        { tag:"TextField", name:"ending_latitude_minute", type:"number",
            placeholder:"Enter Ending Latitude (minute)", label:'Latitude (minute',
            variant:"outlined", required:true, 
            xs:12, sm:4.5, fullWidth:true,
            minValue:0, maxValue:60, helperText:"de 0 à 60",
            endAdornment:{pos:'end', text:'min'}
        },
        { tag:"Select", name:"ending_latitude_ns", type:"select", 
            placeholder:"N/S", label:'Latitude (N/S)',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:3, sx:{m:0,minWith:150},
            choice:[
                {id:1,value:"North"},
                {id:2,value:"South"}
            ]
        },
        { tag:"TextField", name:"ending_longitude_degree", type:"number", 
            placeholder:"Enter Ending Longitude (degree)", label:'Longitude (degree)',
            variant:"outlined", required:true, 
            xs:12, sm:4.5, fullWidth:true, 
            minValue:0, maxValue:180, helperText:"de 0 à 180°",
            endAdornment:{pos:'end', text:'°'}
        },
        { tag:"TextField", name:"ending_longitude_minute", type:"number", 
            placeholder:"Enter Ending Longitude (minute", label:'Longitude (minute',
            variant:"outlined", required:true, 
            xs:12, sm:4.5, fullWidth:true, 
            minValue:0, maxValue:180, helperText:"de 0 à 180°",
            endAdornment:{pos:'end', text:'°'}
        },
        { tag:"Select", name:"ending_longitude_ew", type:"select", 
            placeholder:"E/O", label:'Longitude (N/S)',
            variant:"outlined", required:true, 
            xs:12, sm:3, sx:{m:0,minWith:150}, fullWidth:true,
            choice:[
                {id:1, value:"East"},
                {id:2, value:"West"}
            ]
        },
        ]
    },
    {
        title:"Ship",
        section:
        [
        { tag:"TextField", name:"ship", 
            placeholder:"Ship Name", label:'Ship',
            variant:"outlined", required:true, 
            xs:12, sm:12, size:"regular", fullWidth:true,
        },
        { tag:"TextField", name:"ctd_reference", 
            placeholder:"CTD reference (filename)", label:'CTD reference',
            variant:"outlined", required:true, 
            xs:12, sm:12, fullWidth:true
        },
    ]
    },
    {
        title:"Sample",
        section:
        [
        { tag:"TextField", name:"number_of_tow", type:"number", 
            placeholder:"Number of tow in the same sample", label:'Number of tow in the same sample',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:6,
            minValue:0, helperText:'value greather than zero'
        },
        { tag:"TextField", name:"filtered_volume", type:"number", 
            placeholder:"Total filtered volume (m3). (sum of the nets). 99999 if unknown)", label:'Total filtered',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:6,
            endAdornment:{pos:'end', text:'m3'},
            minValue:0, helperText:'value greather than zero',
        },
        { tag:"Select", name:"quality_flag_filtered_volume", type:"select", 
            placeholder:"Quality Flag of the filtered volume of the net", label:'Quality Flag of the filtered volume of the net',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12, sx:{m:0, minWith:300},
            choice:[
                {id:1, value:"RECORDED volume (flowmeter)"},
                {id:2, value:"West"}
            ]
        },
        { tag:"TextField", name:"sample_comment", type:"text", 
            placeholder:"Add sample comment", label:'Add sample comment',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:12
        },
    
        { tag:"TextField", name:"number_of_jars", type:"number", 
            placeholder:"Nb of jars for the sample, 9999 if not documented", label:'Nb of jars for the sample, 9999 if not documented',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12,
            minValue:0, helperText:'value greather than zero',
        },
        { tag:"TextField", name:"barcode", type:"number", placeholder:"Barcode", label:'Barcode',
            variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
        },
        { tag:"TextField", name:"other_reference", type:"text", placeholder:"Other reference (NaN if non applicable)", label:'Other reference',
            variant:"outlined", fullWidth:true, required:false, xs:12, sm:6
        },
    
        { label:'JAR airtighness',
            name:"jar_airtighness", placeholder:"JAR airtighness",
            tag:"Select",  type:"select", 
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12, sx:{m:0, minWith:300},
            choice:[
                {id:1, value:"JAR airtighness OK"},
                {id:2, value:"JAR airtighness NOK"},
            ]
        },
        { tag:"Select", name:"sample_richness", type:"select", 
            placeholder:"Sample richness", label:'Sample richness',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12, sx:{m:0, minWith:300},
            choice:[
                {id:1, value:"NORMAL richness"},
                {id:2, value:"VERY RICH sample"},
                {id:2, value:"NO PLANKTON (almost) in sample"}
            ]
        },
        { tag:"Select", name:"sample_conditioning", type:"select", 
            placeholder:"Sample conditioning", label:'Sample conditioning',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12, sx:{m:0, minWith:300},
            choice:[
                {id:1, value:"GOOD conditionning"},
                {id:2, value:"DRYED (no remaining liquid)"},
                {id:2, value:"ROTTEN (loss of fixative)"}
            ]
        },
        { tag:"Select", name:"sample_content", type:"select", 
            placeholder:"Sample content", label:'Sample content',
            variant:"outlined", fullWidth:true, required:true, 
            xs:12, sm:12, sx:{m:0, minWith:300},
            choice:[
                {id:1, value:"NO disturbing elements"},
                {id:2, value:"ONE or FEW very large objects present in the jar"},
                {id:3, value:"SOUP (phytoplankton - organic matter - clay/mud/mineral)"}
            ]
        },
        ]
    }
    ]

    export const fraction_inputFormElments=[
        {
            title:"Scan ID",
            section:[
            { tag:"DisabledField", name:"scan_id", type:"text", placeholder:"Scan ID", label:'Scan ID',
                variant:"outlined", disabled:true,
                xs:12, sm:12, fullWidth:true, // value:1,
                fn2: { 
                    params:"{project,sample}",
                     func:'return String(sample)+"_"'
                    // params:"{project,sample,fraction_number}",
                    //  func:'return String(project)+"_"+String(sample)+"_"+String(fraction_number)+"_"'
                    },
                update: {
                    params:"{fraction_id,fraction_id_suffix}",
                     func:'return fraction_id_suffix!==""?(String(fraction_id)+"_"+String(fraction_id_suffix)):String(fraction_id)'
                }
            },

            // { tag:"Select", name:"fraction_type", type:"select", 
            //     placeholder:"Could be d1,d2, tot...", label:'Fraction Type',
            //     variant:"outlined", fullWidth:true, required:true, 
            //     xs:12, sm:6, sx:{m:0, minWith:300},
            //     choice:[
            //         {id:1, value:"Tot"},
            //         {id:2, value:"d1"},
            //         {id:3, value:"d2"},
            //         {id:4, value:"d2_bis"},
            //     ]
            // },
            { tag:"TextField", name:"fraction_id", type:"text",
                placeholder:"Fraction identifier  tot, d1, d2, ...", label:'Fraction of sample',
                variant:"outlined", required:true, disabled:false,
                xs:12, sm:4, fullWidth:true, // value:1,
                refresh:"scan_id"
            },
            { tag:"TextField", name:"fraction_id_suffix", type:"text", 
                placeholder:"Could be 01,02, ...", label:'Fraction ID Suffix',
                variant:"outlined", required:false, disabled:false,
                xs:4, sm:2, fullWidth:true, //value:2,
                refresh:"scan_id"
            },

            // { tag:"TextField", name:"sample_id", type:"text", placeholder:"Sample ID", label:'Sample ID',
            //     variant:"outlined", disabled:true,
            //     xs:12, sm:12, fullWidth:true, value:1,
            //     fn2: { params:"{project}", func:'return String(project)+"_"' }
            // },
            { tag:"TextField", name:"scanning_operator", type:"text", 
                placeholder:"Scanning operator", label:'Scanning operator',
                variant:"outlined", required:false, disabled:true,
                xs:12, sm:12, fullWidth:true
            },

            ]
        },
        {
            title:"Metadata",
            section:
            [
            // { tag:"TextField", name:"fraction_type", type:"text", 
            //     placeholder:"Could be d1,d2, tot...", label:'Fraction Type',
            //     variant:"outlined", required:true, disabled:false,
            //     xs:8, sm:6, fullWidth:true, value:1
            //     // a passer en non modifiable pour les scans suivant (les number series)
            // },

            // { tag:"Empty", xs:0, xm:6 },
            // { tag:"TextField", name:"fraction_number", type:"text", 
            //     placeholder:"Fraction Number", label:'Fraction Number',
            //     variant:"outlined", required:true, disabled:false,
            //     xs:12, sm:4, fullWidth:true, value:1
            // },
    
            { tag:"TextField", name:"fraction_min_mesh", type:"number", 
                placeholder:"Fraction min mesh", label:'min mesh',
                variant:"outlined", required:true, 
                xs:12, sm:6, fullWidth:true,
                endAdornment:{pos:'end', text:'µm'},
                minValue:0, helperText:'value greather than or equal to zero'
            },
            { tag:"TextField", name:"fraction_max_mesh", type:"number", 
                placeholder:"Fraction max mesh", label:'Max mesh',
                variant:"outlined", required:true,
                xs:12, sm:6, fullWidth:true,
                endAdornment:{pos:'end', text:'µm'},
                minValue:0, helperText:'value greather than or equal to zero'
            },
            { tag:"TextField", name:"spliting_ratio", type:"number", 
                placeholder:"Fraction spliting ratio x (1/x)", label:'Spliting ratio',
                variant:"outlined", required:true, 
                xs:12, sm:12, fullWidth:true,
                endAdornment:{pos:'end', text:'1/x'},
                minValue:0, helperText:'value greather than or equal to zero'
            }, 
                // TODO: below should be { tag:"InputSelect", name:"submethod", type:"select", 
                //  but then the value is not read or sent via API 
            { tag:"TextField", name:"submethod", type:"text", 
                placeholder:"Pick or enter one", label:'Sub Method',
                variant:"outlined", fullWidth:true, required:true, 
                xs:12, sm:6, //sx:{m:0, minWith:300},
                choice:[
                    {id:1, value:"Motoda"},
                    {id:2, value:"Johnson"},
                    {id:3, value:"<NAME>"},
                ]
            },
            { tag:"TextField", name:"observation", type:"text", 
                placeholder:"Observation", label:'Observation',
                variant:"outlined", required:true, 
                xs:12, sm:12, fullWidth:true
            },
            ]
        }
        ]


    // export const fraction_inputFormElments=[
    // {
    //     title:"Metadata",
    //     section:[
    //     { tag:"TextField", name:"scan_id", type:"text", placeholder:"Scan ID", label:'Scan ID',
    //         variant:"outlined", disabled:true,
    //         xs:12, sm:12, fullWidth:true, value:1,
    //         fn2: { params:"{project,sample}", func:'return String(project)+"_"+String(sample)+"_"' }
    //     },
    //     { tag:"TextField", name:"sample_id", type:"text", placeholder:"Sample ID", label:'Sample ID',
    //         variant:"outlined", disabled:true,
    //         xs:12, sm:12, fullWidth:true, value:1,
    //         fn2: { params:"{project}", func:'return String(project)+"_"' }
    //     },
    //     { tag:"TextField", name:"scanning_operator", type:"text", 
    //         placeholder:"Scanning operator", label:'Scanning operator',
    //         variant:"outlined", required:true, 
    //         xs:12, sm:12, fullWidth:true
    //     },
    //     { tag:"TextField", name:"observation", type:"text", 
    //         placeholder:"Observation", label:'Observation',
    //         variant:"outlined", required:true, 
    //         xs:12, sm:12, fullWidth:true
    //     },
    //     ]
    // },
    // {
    //     title:"Fraction",
    //     section:
    //     [
    //     // { tag:"TextField", name:"fraction_type", type:"text", 
    //     //     placeholder:"Could be d1,d2, tot...", label:'Fraction Type',
    //     //     variant:"outlined", required:true, disabled:false,
    //     //     xs:8, sm:6, fullWidth:true, value:1
    //     //     // a passer en non modifiable pour les scans suivant (les number series)
    //     // },
    //     { tag:"Select", name:"fraction_type", type:"select", 
    //         placeholder:"Could be d1,d2, tot...", label:'Fraction Type',
    //         variant:"outlined", fullWidth:true, required:true, 
    //         xs:12, sm:6, sx:{m:0, minWith:300},
    //         choice:[
    //             {id:1, value:"Tot"},
    //             {id:2, value:"d1"},
    //             {id:3, value:"d2"},
    //             {id:4, value:"d2_bis"},
    //         ]
    //     },
    //     { tag:"TextField", name:"fraction_number", type:"text", 
    //         placeholder:"Number of scans", label:'Fraction of scans',
    //         variant:"outlined", required:true, disabled:false,
    //         xs:12, sm:4, fullWidth:true, value:1
    //     },
    //     { tag:"TextField", name:"fraction_id_suffix", type:"text", 
    //         placeholder:"Could be 01,02, ...", label:'Fraction ID Suffix',
    //         variant:"outlined", required:false, disabled:false,
    //         xs:4, sm:2, fullWidth:true, value:1
    //     },
    //     // { tag:"Empty", xs:0, xm:6 },
    //     // { tag:"TextField", name:"fraction_number", type:"text", 
    //     //     placeholder:"Fraction Number", label:'Fraction Number',
    //     //     variant:"outlined", required:true, disabled:false,
    //     //     xs:12, sm:4, fullWidth:true, value:1
    //     // },

    //     { tag:"TextField", name:"fraction_min_mesh", type:"number", 
    //         placeholder:"Fraction min mesh", label:'min mesh',
    //         variant:"outlined", required:true, 
    //         xs:12, sm:6, fullWidth:true,
    //         endAdornment:{pos:'end', text:'µm'},
    //         minValue:0, helperText:'value greather than or equal to zero'
    //     },
    //     { tag:"TextField", name:"fraction_max_mesh", type:"number", 
    //         placeholder:"Fraction max mesh", label:'Max meshsubmethod',
    //         variant:"outlined", required:true,
    //         xs:12, sm:6, fullWidth:true,
    //         endAdornment:{pos:'end', text:'µm'},
    //         minValue:0, helperText:'value greather than or equal to zero'
    //     },
    //     { tag:"TextField", name:"spliting_ratio", type:"number", 
    //         placeholder:"Fraction spliting ratio x (1/x)", label:'Spliting ratio',
    //         variant:"outlined", required:true, 
    //         xs:12, sm:12, fullWidth:true,
    //         endAdornment:{pos:'end', text:'1/x'},
    //         minValue:0, helperText:'value greather than or equal to zero'
    //     },    
    //     // { tag:"TextField", name:"remark_on_fraction", type:"text", 
    //     //     placeholder:"Remark on fraction (no special char !)", label:'Remark on fraction',
    //     //     variant:"outlined", required:true, 
    //     //     xs:12, sm:6, fullWidth:true,
    //     //     helperText:"no special char !",
    //     //     regex:"^[a-zA-Z0-9_ %&°]+$", error:true
    //     // },
    //     // { tag:"TextField", name:"submethod", type:"text", 
    //     //     placeholder:"SubMethod", label:'SubMethod',
    //     //     variant:"outlined", required:true, 
    //     //     xs:12, sm:6, fullWidth:true
    //     //     // liste modifiable
    //     //     // motoda
    //     //     // a enregistrer pour tout les projets
    //     // },
    //     { tag:"InputSelect", name:"submethod", type:"select", 
    //         placeholder:"SSubMethod", label:'SubMethod',
    //         variant:"outlined", fullWidth:true, required:true, 
    //         xs:12, sm:6, sx:{m:0, minWith:300},
    //         choice:[
    //             {id:1, value:"Motoda"},
    //             {id:2, value:"Johnson"},
    //             {id:3, value:"<NAME>"},
    //         ]
    //     },

    //     ]
    // }
    // ]
    
    
    
    export const userFormElements=[
        {
            title:"User",
            section:
            [
                { name:"name", placeholder:"Enter name", label:'Name',
                    tag:"TextField", type:"text",
                    variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                },
                // { name:"firstname", placeholder:"Enter first name", label:'First Name',
                //     variant:"outlined", fullWidth:true, required:false, xs:12, sm:6, size:"small"
                // },
                // { name:"lastname", placeholder:"Enter last name", label:'Last Name',
                //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                // },

                { name:"email", type:"email", placeholder:"Enter email", label:'Email',
                    tag:"TextField", type:"text",
                    variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                },

                // { name:"phone", type:"number", placeholder:"Enter phone number", label:'Phone',
                //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                // },
                // { name:"login ecotaxa", placeholder:"Login Ecotaxa", label:'Street',
                //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                // },
                // { name:"password Ecotaxa", type:"password", placeholder:"password Ecotaxa", label:'City',
                //     variant:"outlined", fullWidth:true, required:true, xs:12, sm:6
                // },

                { name: "role", placeholder: "ROLE", label: 'Role',
                    tag: "Select",  type: "select", 
                    variant:"outlined",  required: true, 
                    xs:12, sm:6, size: "small",
                    choice:[
                        {id:"USER", value: "USER"},
                        {id:"MANAGER", value: "MANAGER"},
                        {id:"ADMIN", value: "ADMIN"},
                    ],
                    value:"USER"
                },

            ]
        }
    ]

    export const projectElements= [
        {
            title:"Project Metadata",
            section:
            [
                { name:"name", placeholder:"Project name", label:'Project Name',
                tag:"TextField", type:"text",
                variant:"outlined",  required:true, 
                prefix:"zooscan_", 
                // minLength:"zooscan_".length, no need I added prefix in endorment
                xs:12, sm:6, size:"small"
                },
                // { name:"drive", placeholder:"Project thematic (tara, archives_lov, ...)", label:'Project Drive',
                // tag:"Select",  type:"select", 
                // variant:"outlined",  required:true, 
                // xs:12, sm:6, size:"small",
                // choice:[
                //     {id:1, value:"archives_lov"},
                //     {id:2, value:"archives_monitoring"},
                //     {id:3, value:"archives_tara"},
                //     {id:4, value:"lov"},
                //     {id:5, value:"microplastik"},
                //     {id:6, value:"monitoring"},
                //     {id:7, value:"tara"},
                // ]
               { name:"drive", placeholder:"Project thematic (tara, archives_lov, ...)", label:'Project Drive',
                tag:"Drives", // type:"select", 
                variant:"outlined",  required:true, 
                xs:12, sm:6, size:"small",
                // choice:[
                //     {id:1, value:"archives_lov"},
                //     {id:2, value:"archives_monitoring"},
                //     {id:3, value:"archives_tara"},
                //     {id:4, value:"lov"},
                //     {id:5, value:"microplastik"},
                //     {id:6, value:"monitoring"},
                //     {id:7, value:"tara"},
                // ]
                },
                { name:"acronym", placeholder:"Project acronym (a quick name for you)", label:'Project Acronym',
                tag:"TextField", type:"text",
                variant:"outlined",  required:true, 
                xs:12, sm:6, size:"small"
                },
                { name:"description", placeholder:"Describe your project here", label:'Project description',
                tag:"TextArea", type:"text",
                variant:"outlined",  
                required:false, disabled:false,
                xs:12, sm:12, //size:"small",
                minRows:4,
                maxRows:4,
                }
            ]
        }
    ]
    
    
    export const projectEcotaxaElements= [
        {
            title:"Ecotaxa",
            section:
            [
                { name:"ecotaxa_project_name", placeholder:"Ecoxata Project name", label:'Ecoxata Project name',
                tag:"TextField", type:"text",
                variant:"outlined", fullWidth:true, 
                required:false, xs:12, sm:12, size:"small"
                },
                { name:"ecotaxa_project_title", placeholder:"Ecoxata Project title", label:'Ecotaxa Project Title',
                required:false, disabled:true,
                tag:"TextField", type:"text",
                variant:"outlined", fullWidth:true, 
                xs:12, sm:12, size:"small"
                },
                { name:"ecotaxa_project", placeholder:"Ecoxa Project id", label:'Ecotaxa Project ID',
                tag:"TextField", type:"text",
                required:false, disabled:true,
                variant:"outlined", fullWidth:true, 
                xs:12, sm:12, size:"small"
                },
            ]
        }
    ]
    



    export const DriveElements = [
        {
            title: "Drive Settings",
            section:
            [
                { name:"name", placeholder:'Name to represent your drive, like "Zooscan Archive"', label:'Drive Name',
                    tag: "TextField", type:"text", //value:'Zooscan Archive',
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:12, size:"small"
                },
                { name:"url", placeholder:'The path where your scan will be save', label:'Path',
                    tag: "TextField", type:"text", //value:'Zooscan Archive',
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:12, size:"small"
                },
            ]
        }
    ]

    export const DriveForm = [
        DriveElements,
    ];

    export const scanningOptions = [
        {
            title:"Scanning Option",
            section:
            [
                { name: "scanningOptions", placeholder: "Frame Type", label: 'Frame Type',
                tag: "Select",  type: "select", 
                variant:"outlined",  required: true, 
                xs:12, sm:6, size: "small",
                choice:[
                    {id:"NARROW", value: "NARROW"},
                    {id:"LARGE", value: "LARGE"},
                    {id:"OTHER", value: "OTHER"},
               ],
                value:"LARGE"
                },
                { name: "density", placeholder: "Density", label: 'Density Type',
                    tag: "Select",  type: "select", 
                    variant:"outlined",  required: true, 
                    xs:12, sm:6, size: "small",
                    choice:[
                        {id:1200, value: "1200 dpi"},
                        {id:2400, value: "2400 dpi"},
                    ],
                    value:"2400"
                },
            ]
        }
    ]

    export const scannerElements = [
        {
            title:"Scanner Metadata",
            section:
            [
                { name:"instrument", placeholder:"Instrument", label:'Instrument',
                    tag:"TextField", type:"text", value:"Zooscan",
                    required:false, disabled:true,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"model", placeholder:"Model", label:'Model',
                    tag:"TextField", type:"text",
                    required:true, disabled:true,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"name", placeholder:"Nickname of the Instrument", label:'Name',
                    tag:"TextField", type:"text",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"sn", placeholder:"Instrument serial number", label:'Serial number',
                    tag:"TextField", type:"text",
                    required:true, disabled:true,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
            ]
        }
    ]

    export const scannerChoice = [
        {
            title:"Scanner",
            section:
            [
                {
                    name: "scanner", placeholder: "Scanner", label: 'Scanner',
                    tag:"Scanner", type:"object",
                    xs:12, sm:12
                },
                // { name:"serial", placeholder:"Instrument", label:'Intrument',
                //     tag:"Instruments", 
                //     required:true, disabled:false,
                //     variant:"outlined", fullWidth:true,
                //     xs:12, sm:12, size:"small"
                // },
                // { name: "scanningOptions", placeholder: "Frame Type", label: 'Frame Type',
                //     tag: "Select",  type: "select", 
                //     variant:"outlined",  required: true, 
                //     xs:12, sm:6, size: "small",
                //     choice:[
                //         {id:"NARROW", value: "NARROW"},
                //         {id:"LARGE", value: "LARGE"},
                //         {id:"OTHER", value: "OTHER"},
                //     ],
                //     value:"LARGE",
                //     // fn2: { 
                //     //     params:"{project,sample}",
                //     //      func:'return String(project)+"_"+String(sample)+"_"'
                //     //     },
                //     // update: {
                //     //     params:"{fraction_number,fraction_id_suffix}",
                //     //      func:'return String(fraction_number)+"_"+String(fraction_id_suffix)'                    
                //     // },
                //     // choiser: { 
                //     //     params:"{fraction_number,fraction_id_suffix}",
                //     //      func:'return String(fraction_number)+"_"+String(fraction_id_suffix)'                    
                //     // }
                // },
                { name: "density", placeholder: "Density", label: 'Density Type',
                    tag: "Select",  type: "select", 
                    variant:"outlined",  required: true, 
                xs:12, sm:6, size: "small",
                    choice:[
                        {id:1200, value: "1200 dpi"},
                        {id:2400, value: "2400 dpi"},
                    ],
                    value:"2400"
                },
            ]
        }
    ]

    export const scannerElementsNew = [
        {
            title:"Scanner Metadata",
            section:
            [
                { name:"instrument", placeholder:"Instrument", label:'Intrument',
                    tag:"TextField", type:"text", value:"Zooscan",
                    required:false, disabled:true,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"model", placeholder:"Model", label:'Model',
                    tag:"TextField", type:"text",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"name", placeholder:"Nickname of the Instrument", label:'Name',
                    tag:"TextField", type:"text",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
                { name:"serial", placeholder:"Instrument serial number", label:'Serial number',
                    tag:"TextField", type:"text",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:true, 
                    xs:12, sm:6, size:"small"
                },
            ]
        }
    ]


    export const scannerCalibrationElements= [
        {
            title:"Scanner Setting",
            section:
            [
                // { name:"optical_density_xposition", placeholder:"Optical density Xposition", label:'Optical density Xposition',
                // tag:"TextField", type:"number",
                // required:false, disabled:true,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                // { name:"optical_density_yposition", placeholder:"Optical density Yposition", label:'Optical density Yposition',
                // tag:"TextField", type:"number",
                // required:false, disabled:true,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                // { name:"frame", placeholder:"Frame type (Large,Narrow)", label:'Frame',
                //     tag:"TextField", type:"string",
                //     required:true, disabled:false,
                //     variant:"outlined", fullWidth:false, 
                //     xs:12, sm:12, size:"small"
                //     },
                    { name: "frame", placeholder: "Frame Type", label: 'Frame Type',
                        tag: "Select",  type: "select", 
                        variant:"outlined",  required: true, 
                        xs:12, sm:12, size: "small",
                        choice:[
                            {id:"NARROW", value: "NARROW"},
                            {id:"LARGE", value: "LARGE"},
                            {id:"OTHER", value: "OTHER"},
                       ],
                        // value:"LARGE"
                        },

                // { name:"xoffset_large", placeholder:"XOffset (Large)", label:'XOffset',
                // tag:"TextField", type:"number",
                // required:false, disabled:false,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                // { name:"yoffset_large", placeholder:"YOffset (Large)", label:'YOffset',
                // tag:"TextField", type:"number",
                // required:false, disabled:false,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                // { name:"xsize_large", placeholder:"XSize (Large)", label:'XSize',
                // tag:"TextField", type:"number",
                // required:false, disabled:false,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                // { name:"ysize_large", placeholder:"YSize (Large)", label:'YSize',
                // tag:"TextField", type:"number",
                // required:false, disabled:false,
                // variant:"outlined", fullWidth:false, 
                // xs:12, sm:6, size:"small"
                // },
                { name:"xOffset", placeholder:"XOffset", label:'XOffset',
                    tag:"TextField", type:"number",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:false, 
                    xs:12, sm:6, size:"small"
                    },
                    { name:"yOffset", placeholder:"YOffset", label:'YOffset',
                    tag:"TextField", type:"number",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:false, 
                    xs:12, sm:6, size:"small"
                    },
                    { name:"xSize", placeholder:"XSize", label:'XSize',
                    tag:"TextField", type:"number",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:false, 
                    xs:12, sm:6, size:"small"
                    },
                    { name:"ySize", placeholder:"YSize", label:'YSize',
                    tag:"TextField", type:"number",
                    required:true, disabled:false,
                    variant:"outlined", fullWidth:false, 
                    xs:12, sm:6, size:"small"
                    },
            ]
        }
    ]
    

    export const scannerForm= [
        // scanningOptions,
        scannerElements,
        // scannerCalibrationElements
    ]

    export const projectForm = [
        projectElements,
        // scanningOptions,
        // scannerElements,
        scannerChoice,
        // scannerCalibrationElements,
        projectEcotaxaElements,
        // scannerForm
    ]
    

    /*
    Dialog.create("Project  : "+proj+"              Image  : "+titrered);
    Dialog.addString("Sample Id ",SampleId);
    Dialog.addString("Zooscan Operator ",Scanop);
    Dialog.addString("Ship ",Ship);
    Dialog.addString("Scientific program ",Scientificprog);
    Dialog.addString("Station Id (''NaN'' if unknown) ",StationId);
    Dialog.addString("Sampling date (YYYYMMDD-HHMM) ",Date);
    Dialog.addNumber("Latitude    (DD.MM for North,   -DD.MM for South) ",Latitude);
    Dialog.addNumber("Longitude (DDD.MM for West, -DDD.MM for Est)   ",Longitude);
    Dialog.addNumber("Bottom Depth (m) ",Depth);
    Dialog.addString("CTD reference (filename) ",CTDref);
    Dialog.addString("Other reference ",Otherref);
    Dialog.addNumber("Number of tow in the same sample ",Townb);
    Dialog.addNumber("Tow type (Oblique = 1, Horizontal = 2, Vertical = 3) ",Towtype);
    Dialog.addString("Net type (WP2, JB, Omori...) ",Nettype);
    Dialog.addNumber("Net mesh (cod end) �m",Netmesh);
    Dialog.addNumber("Net opening surface (m2)",Netsurf);
    Dialog.addNumber("Maximum Depth  (m) : Z max",Zmax);
    Dialog.addNumber("Minimum Depth  (m) : Zmin",Zmin);
    Dialog.addNumber("Filtered volume (m3) ",Vol);
    Dialog.addString("Fraction Id ",FracId);
    Dialog.addNumber("Fraction min mesh (�m) ",Fracmin);
    Dialog.addNumber("Fraction max mesh (�m) ",Fracsup);
    Dialog.addNumber("Fraction spliting ratio x (1/x) ",Fracnb);
    Dialog.addString("Remark (no special char !) ",Observation);
    //	Dialog.addString("Code", Code);
    Dialog.addString("SubMethod",SubMethod);
    //	Dialog.addNumber("CellPart",CellPart);
    //	Dialog.addNumber("Replicates",Replicates);
    //	Dialog.addNumber("VolIni",VolIni);
    //	Dialog.addNumber("VolPrec",VolPrec);
    */
   
