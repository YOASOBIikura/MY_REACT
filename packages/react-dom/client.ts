import type { ReactElement } from "shared/ReactElementType.js";
import { createContainer, updateContainer } from "../reconciler/FiberReconciler.js";
import type { Fiber, FiberRoot } from "../reconciler/ReactInternalTyes.js";


type ReactDomRootType = {
    _internalRoot: FiberRoot;
    render: (element: ReactElement)=>void;
}

function ReactDomRoot(fiberRoot: FiberRoot):ReactDomRootType{
    return {
        _internalRoot: fiberRoot,
        render: function (element: ReactElement) {
            updateContainer(element, this._internalRoot);
        }
    };
}

/**
 * 初始化react，创建根节点
 */
function  createRoot(container: HTMLElement) {
    const fiberRoot = createContainer(container);
    return ReactDomRoot(fiberRoot);
}


export {createRoot}
