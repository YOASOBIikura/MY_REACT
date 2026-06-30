export const ReactSharedInternals:any = {
    H: null
}

export function useState(initialState: any){
    return ReactSharedInternals.H.useState(initialState);
}

export function useEffect(create:()=>(()=>void|void), createDeps?: any[]){
    return ReactSharedInternals.H.useEffect(create, createDeps);
}

export const version = '1.0.0';