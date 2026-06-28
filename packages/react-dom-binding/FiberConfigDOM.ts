import type { Fiber } from "packages/reconciler/ReactInternalTyes.js";
import { precacheFiberNode } from "./ReactDomComponentTree.js";

export type Instance = HTMLElement;
export type TextInstance = Text;

/**
 * 创建DOM节点
 */
export function createDom(type:string, fiber: Fiber){
    let domElement = document.createElement(type);
    precacheFiberNode(fiber, domElement);
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
 * 插入DOM节点
 * @param parent 父节点 
 * @param child 子节点
 * @param before 兄弟节点
 */
export function insertBefore(parent: Instance, child: Instance, before: Instance){
    parent.insertBefore(child, before);
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

/**
 * 更新文本节点
 * @param textInstance 
 * @param text 
 */
export function commitTextUpdate(textInstance: TextInstance, text: string){
    textInstance.nodeValue = text;
}

/**
 * 设置属性值
 * @param dom
 * @param prop
 * @param value
 */
export function setProp(dom: Instance, prop: string, value: any){
    switch(prop){
        case 'child': {
            if(typeof value === 'string' || typeof value === 'number'){
                dom.textContent = value.toString();
            }
            break;
        }
        default: {
            dom.setAttribute(prop, value);
        }
    }
}

/**
 * 调度微任务
 */
 export const scheduleMicroTask = typeof queueMicrotask === 'function'?queueMicrotask:(callback:()=>void)=>Promise.resolve().then(callback);
