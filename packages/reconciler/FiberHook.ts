import { updateContainer } from "./FiberReconciler.js";
import type { Fiber } from "./ReactInternalTyes.js"
import { getRootForUpdateFiber, scheduleUpdateOnFiber } from "./WorkLoop.js";
import { ReactSharedInternals } from "packages/react/index.js";

export type Hook = {
    memoizedState: any,
    dispatch: any,
    next: Hook | null,
}

// 当前正在渲染的fiber
let currentlyRenderingFiber: Fiber|null = null;

// 当前工作的hook
let workInProgressHook: Hook|null = null;

// 定义一个导出的状态管理hook
// export let useState:any = null; 



/**
 * 分发更新组件状态值
 * 1. 更改状态值
 * 2. 重新渲染组件
 * @param Fiber hook所在的fiber
 * @param hook 当前的hook
 * @param newState 新的状态值
 */
function dispatchSetState(fiber: Fiber, hook: Hook, newState: any){
    hook.memoizedState = newState;
    const fiberRoot = getRootForUpdateFiber(fiber);
    scheduleUpdateOnFiber(fiberRoot);
}

/**
 * 创建一个状态管理的hook
 * 1. 创建一个hook
 * 2. 将hook挂载到fiber的memoizedState上
 * 3. 返回状态和更新状态的方法
 */
// export function useState(initialState: any){
//     const hook = {
//         memoizedState: currentlyRenderingFiber!.memoizedState ? 
//         currentlyRenderingFiber!.memoizedState.memoizedState :
//         initialState 
//     }
//     currentlyRenderingFiber!.memoizedState = hook;
//     return [hook.memoizedState, setState];
// }

/**
 * mount阶段创建hook对象
 * @param initialState 初始阶段
 * @returns hook对象
 */
function mountWorkInProgressHook(initialState: any){
     const hook: Hook = {
        memoizedState: initialState,
        dispatch: null,
        next: null 
    }
    if(workInProgressHook == null){
        currentlyRenderingFiber!.memoizedState = hook;
    }else{
        workInProgressHook!.next = hook;
    }
    workInProgressHook = hook;
    return hook;
}

/**
 * 首次创建时状态管理的hook
 * 1. 创建一个hook
 * 2. 将hook挂载到fiber的memoizedState上
 * 3. 返回状态和更新状态的方法
 * @param initialState 初始状态
 * @returns [state, setState]
 */
export function mountState(initialState:any){
    const hook = mountWorkInProgressHook(initialState);
    const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, hook);
    hook.dispatch = dispatch;
    return [hook.memoizedState, dispatch];
} 

/**
 * 更新状态管理的hook
 * 1. 获取当前fiber的hook
 * 2. 返回状态和更新状态的方法
 */
export function updateState(){
    const hook = updateWorkInProgressHook();
    return [hook!.memoizedState, hook!.dispatch];
}

/**
 * update阶段获取当前的hook
 * @returns 当前的hook
 */
function updateWorkInProgressHook(){
    if(workInProgressHook === null){
        workInProgressHook = currentlyRenderingFiber!.memoizedState;
    }else{
        workInProgressHook = workInProgressHook.next;
    }
    return workInProgressHook;
}

/**
 * 渲染函数组件，考虑hooks，并返回组件的返回值
 * 1. 设置当前正在渲染的fiber
 * 2. 执行函数组件的函数
 * @param workInProgress 当前正在渲染的fiber
 * @param Component 函数组件
 * @return 组件的返回值
 */
export function renderWihtHooks(workInProgress: Fiber, Component: any){
    currentlyRenderingFiber = workInProgress;
    // 根据组件是否存在memoizedState状态来判断是首次加载还是二次更新
    if(currentlyRenderingFiber!.memoizedState === null){
        ReactSharedInternals.H = mountState;
    }else{
        ReactSharedInternals.H = updateState;
    }
    const result = Component();
    workInProgressHook = null;
    currentlyRenderingFiber = null;
    return result;
}


