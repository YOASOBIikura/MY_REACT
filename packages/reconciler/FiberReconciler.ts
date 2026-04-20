import type { ReactElement } from "shared/ReactElementType.js";
import { createFiberFromElement, createHostRootFiber } from "./Fiber.js";
import { createFiberRoot } from "./FiberRoot.js";
import type { Fiber } from "./ReactInternalTyes.js";
import { workLoop } from "./WorkLoop.js";
import { appendChild } from "./FiberConfigDOM.js";


/**
 * 创建FiberRoot, HostRootFiber, 并建立关联
 */
export function createContainer(containerInfo: HTMLElement){
    const root = createFiberRoot(containerInfo); // FiberRoot
    const hostRootFiber = createHostRootFiber(); // 创建HostRootFiber
    hostRootFiber.stateNode = root;
    return hostRootFiber
}


/**
 * 更新容器
 * 1. 构建子fiber
 * 2. 关联hostRootFiber和子fiber
 * 3. 挂载子fiber到root dom上去
 */
export function updateContainer(element: ReactElement, root: Fiber){
    // 1. 构建子fiber
    const containerFiber = createFiberFromElement(element);
    workLoop(containerFiber);
    // 2. 关联hostRootFiber和子Fiber
    root.child = containerFiber;
    containerFiber.return = root;
    // 3. 挂载子fiber到root dom上去
    appendChild(root.stateNode.containerInfo, root.child?.stateNode);
}

