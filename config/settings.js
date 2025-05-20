
export let debug = false
// export var debug = true
// export let debug = process.env.DEBUG || false

export var debugForm = [] 
debugForm['project'] = false

export const  isDebugFormEnabled = (form) => {
    return debugForm.includes(form)
}

