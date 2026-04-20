
import { appendChild, createDom, createTextInstance, setInitialProps, type Instance } from "./FiberConfigDOM.js";
import { FunctionComponent, HostComponent, HostText, type Fiber } from "./ReactInternalTyes.js";

/**
 * 遍历当前节点的子节点，并将子节点的stateNode与当前节点的stateNode相关联
 * @param parent 
 * @param child 
 */
function appendAllChildren(parent: Instance, child: Fiber|null){
    let node: Fiber|null = child;
    while(node){
        let childStateNode = node.tag === FunctionComponent ? node.child?.stateNode : node.stateNode;
        appendChild(parent, childStateNode);
        node = node.sibling;
    }
}


//构建Fiber回溯阶段，节点完成状态要干的事情
/**
 * 1. 创建真实的DOM节点
 * 2. 设置stateNode
 */
export function completeWork(fiber: Fiber){

    switch(fiber.tag){
        case HostText:
            fiber.stateNode = createTextInstance(fiber.pendingProps);
            break;
        case FunctionComponent:
            break;
        case HostComponent:
             // 1. 创建真实的DOM节点
            const instance = createDom(fiber.type)
            // 关联Dom节点
            appendAllChildren(instance, fiber.child);
            // 设置属性 
            setInitialProps(instance, fiber.pendingProps)
            // 2. 设置stateNode
            fiber.stateNode = instance
            break
    }
    
}
