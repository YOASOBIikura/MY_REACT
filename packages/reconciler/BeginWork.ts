import { reconcileChildFibers } from "./ChildFiber.js";
import { createFiberFromElement } from "./Fiber.js";
import { renderWihtHooks } from "./FiberHook.js";
import { FunctionComponent, HostComponent, HostRoot, HostText, type Fiber } from "./ReactInternalTyes.js";


// 广度水平遍历children，给每个children创建Fiber，并且返回第一个children Fiber
export function beginWork(fiber: Fiber): Fiber|null {

    // 纯文本节点
    if(typeof fiber.pendingProps.children === 'string' ||
        typeof fiber.pendingProps.children === 'number'
    ){
        return null;
    }

    switch(fiber.tag){
        case HostRoot:
            return null;
        case FunctionComponent: // 处理函数组件
            const children = renderWihtHooks(fiber, fiber.type);
            fiber.child = reconcileChildFibers(fiber, children)
            return fiber.child;
        case HostComponent: // 处理普通fiber组件
            fiber.child = reconcileChildFibers(fiber, fiber.pendingProps.children);
            return fiber.child;
        default:
            return null;
    }
}