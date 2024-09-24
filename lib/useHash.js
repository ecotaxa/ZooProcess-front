import { useState, useEffect } from 'react'

export const useHash = () => {

  const cleanHash = () => { (typeof window != 'undefined' ? decodeURIComponent(window.location.hash.replace('#','')) : undefined)}


    // const [ hash , setHash ] = useState(cleanHash)
    const [ hash , setHash ] = useState(window.location.hash)


    useEffect( () => {
        const onHashchange = () => {
            // setHash(window.location.hash)
            setHash(cleanHash)
        };

        window.addEventListener('hashchange', onHashchange)
        return () => window.removeEventListener('hashchange', onHashchange)
    }, [])

    return hash
}

