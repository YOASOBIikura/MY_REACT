import type { ReactElement } from "shared/ReactElementType.js";
import { createContainer, updateContainer } from "../reconciler/FiberReconciler.js";
import type { Fiber } from "../reconciler/ReactInternalTyes.js";


type ReactDomRootType = {
    _internalRoot: Fiber;
    render: (element: ReactElement)=>void;
}

function ReactDomRoot(hostRootFiber: Fiber):ReactDomRootType{
    return {
        _internalRoot: hostRootFiber,
        render: function (element: ReactElement) {
            updateContainer(element, this._internalRoot);
        }
    };
}

/**
 * 初始化react，创建根节点
 */
function  createRoot(container: HTMLElement) {
    const hostRootFiber = createContainer(container);
    return ReactDomRoot(hostRootFiber);
}


export {createRoot}
