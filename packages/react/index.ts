export const ReactSharedInternals:any = {
    H: null
}

export function useState(initialState: any){
    return ReactSharedInternals.H(initialState);
}

export const version = '1.0.0';