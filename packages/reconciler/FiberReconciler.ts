import type { ReactElement } from "shared/ReactElementType.js";
import { createFiberFromElement, createHostRootFiber } from "./Fiber.js";
import { createFiberRoot } from "./FiberRoot.js";
import type { Fiber, FiberRoot } from "./ReactInternalTyes.js";
import { updateOnFiber } from "./WorkLoop.js";
import { appendChild } from "../react-dom-binding/FiberConfigDOM.js";
import { internalInstanceKey } from "packages/react-dom-binding/ReactDomComponentTree.js";
import { accumulateSinglePhaseListeners, listenToAllSupportedEvents, processEventQueueItemsInOrder } from "packages/react-dom-binding/DomPluginEventSystem.js";
import createSyntheticEvent from "packages/react-dom-binding/SyntheticeEvent.js";
import { commitMutaionEffects } from "./CommitWork.js";


/**
 * 创建FiberRoot, HostRootFiber, 并建立关联
 */
export function createContainer(containerInfo: HTMLElement){
    const fiberRoot = createFiberRoot(containerInfo); // FiberRoot
    const hostRootFiber = createHostRootFiber(); // 创建HostRootFiber
    hostRootFiber.memoizedState = {element: null};
    hostRootFiber.stateNode = fiberRoot;
    fiberRoot.current = hostRootFiber;
    listenToAllSupportedEvents(fiberRoot.containerInfo);
    return fiberRoot;
}


/**
 * 更新容器
 * 1. 构建fiber树
 * 2. 挂载子fiber到root dom上去
 */
export function updateContainer(element: ReactElement, fiberRoot: FiberRoot){
    fiberRoot.current!.memoizedState.element = element;
    updateOnFiber(fiberRoot);
}

