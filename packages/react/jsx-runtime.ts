import type { ReactElement } from "shared/ReactElementType.js";

function ReactElement(type: any, props: any, key: any, ref: any): ReactElement{
    return {
        $$typeof: typeof Symbol === 'function' && Symbol.for ? Symbol.for('du1React') : 'du1React',
        type,
        props,
        key,
        ref
    }
}

export function jsx(type: any, config:any, maybeKey?:any): ReactElement{
    let key = null;
    if(maybeKey !== undefined){
        key = '' + maybeKey;
    }
    if(config.key !== undefined){
        key = '' + config.key;
    }

    const ref = config.ref?config.ref:null;
    const props: any = {};

    if(config.key !== undefined){
        for(const propName in config){
            if(propName !== 'key' && propName !== 'ref'){
                props[propName] = config[propName]
            }
        }
    }else{
        for(const propName in config){
            if(propName !== 'ref'){
                props[propName] = config[propName]
            }
        }
    }
    return ReactElement(type, props, key, ref);
}
