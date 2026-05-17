import { beginWork } from "./BeginWork.js";
import { completeWork } from "./CompleteWork.js";
import { appendChild, removeChild } from "../react-dom-binding/FiberConfigDOM.js";
import type { Fiber, FiberRoot } from "./ReactInternalTyes.js";
import { commitMutaionEffects } from "./CommitWork.js";
import { createWorkInProgress } from "./Fiber.js";

// 当前正在处理的节点
let workInProgress:Fiber|null = null;


/**
 * 完成当前工作，对当前节点进行回溯阶段，并触发完成工作
 */
function completeUnitOfWork(fiber: Fiber){
    let completedWork: Fiber|null = fiber
    do{
        completeWork(completedWork);
        if(completedWork.sibling){
            workInProgress = completedWork.sibling;
            return;
        }

        completedWork = completedWork.return;
        workInProgress = completedWork;
    }while(completedWork)
}

/**
 * 执行单元工作，对当前节点进行向下遍历，并触发开始工作
 */
function performUnitOfWork(fiber: Fiber){
    let next = beginWork(fiber)
    if(next){
        workInProgress = next;
    }else{
        completeUnitOfWork(fiber);
    }
}


/**
 * 遍历Fiber节点，完成对应工作
 */
export function workLoop(){
    
    while(workInProgress){
        // 向下的工作
        performUnitOfWork(workInProgress)
    }
}

/**
 * 向上获取hostRootFiber
 * @param fiber
 * @return hostRootFiber
 */
export function getRootForUpdateFiber(fiber: Fiber): FiberRoot{
    let node = fiber;
    while(node.return){
        node = node.return
    }
    return node.stateNode;
}

/**
 * 更新Fiber树
 * @param fiber
 */
export function updateOnFiber(fiberRoot: FiberRoot){
    
    if(fiberRoot.current?.child?.stateNode){
        removeChild(fiberRoot.containerInfo, fiberRoot.current.child?.stateNode);
    }
    workInProgress = createWorkInProgress(fiberRoot.current!, fiberRoot.current!.pendingProps);
    workLoop();
    // 重新挂载已经更新了的dom
    commitMutaionEffects(fiberRoot.current!.alternate!);
    fiberRoot.current = fiberRoot.current!.alternate;
}
