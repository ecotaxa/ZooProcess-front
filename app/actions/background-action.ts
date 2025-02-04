'use server'

export async function handleValidAction(value: string, onValid: (value: string) => void) {
    onValid(value)
}
