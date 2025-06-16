

// lib/errors.ts  (aucun 'use client' / 'use server')
export class ValidationError extends Error {
    public payload: any;

    constructor(message: string, payload?: any) {
        super(message);
        this.name = 'ValidationError';
        this.payload = payload;
    }
}


