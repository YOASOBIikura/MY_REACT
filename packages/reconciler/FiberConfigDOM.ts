export type Instance = HTMLElement;
export type TextInstance = Text;

/**
 * 创建DOM节点
 */
export function createDom(type:string){
    return document.createElement(type);
}

/**
 * 创建文本节点
 * @param text 
 * @returns 
 */
export function createTextInstance(text: string){
    return document.createTextNode(text);
}

/**
 * 关联DOM节点之间的关系
 */
export function appendChild(parent: Instance, child: Instance){
    parent.appendChild(child);
}

/**
 * 删除dom节点
 */
export function removeChild(parent: Instance, child: Instance){
    parent.removeChild(child);
} 

/**
 * 设置属性
 */
export function setInitialProps(dom: Instance, props: any){
    for(const prop in props){
        // 过滤原型属性
        if(!props.hasOwnProperty(prop)){
            continue;
        }
        if(prop === 'children'){
            if(typeof props.children === 'string' || typeof props.children === 'number'){
                dom.textContent = props.children;
            }
            continue;
        }
        dom.setAttribute(prop, props[prop])  
    }
}


