import type { ReactElement } from "shared/ReactElementType.js";
import { createFiberFromElement, createHostRootFiber } from "./Fiber.js";
import { createFiberRoot } from "./FiberRoot.js";
import type { Fiber } from "./ReactInternalTyes.js";
import { workLoop } from "./WorkLoop.js";
import { appendChild } from "../react-dom-binding/FiberConfigDOM.js";
import { internalInstanceKey } from "packages/react-dom-binding/ReactDomComponentTree.js";
import { accumulateSinglePhaseListeners, listenToAllSupportedEvents, processEventQueueItemsInOrder } from "packages/react-dom-binding/DomPluginEventSystem.js";
import createSyntheticEvent from "packages/react-dom-binding/SyntheticeEvent.js";
import { commitMutaionEffects } from "./CommitWork.js";


/**
 * 创建FiberRoot, HostRootFiber, 并建立关联
 */
export function createContainer(containerInfo: HTMLElement){
    const root = createFiberRoot(containerInfo); // FiberRoot
    const hostRootFiber = createHostRootFiber(); // 创建HostRootFiber
    hostRootFiber.stateNode = root;
    listenToAllSupportedEvents(root.containerInfo);
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
    commitMutaionEffects(root);
}

