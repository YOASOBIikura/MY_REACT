import { HostComponent, type Fiber } from "packages/reconciler/ReactInternalTyes.js";
import { internalInstanceKey } from "./ReactDomComponentTree.js";
import createSyntheticEvent from "./SyntheticeEvent.js";


// 顶层事件之原生dom事件到React事件的映射
const topLevelEventsToReactNames: Map<string, string> = new Map([
    ['click', 'onClick'],
    ['focus', 'onFocus'],
    ['input', 'onInput']
])

/**
 * 事件监听器
 * fiber Fiber
 * listener 方法
 * currentTarget 当前事件目标
 */
type DispatchListener = {
    listener: Function;
    currentTarget: EventTarget | null;
    fiber: Fiber | null;
}

/**
 * 创建事件监听器
 * @param fiber Fiber
 * @param listener 方法
 * @param currentTarget 当前事件目标 
 * @returns 事件监听器
 */
function createDispatchListener(fiber: Fiber | null, listener: Function, currentTarget: EventTarget | null): DispatchListener {
    return {
        listener,
        currentTarget,
        fiber
    }
}

/**
 * 收集事件
 * 累计单向监听器--收集单一阶段的方法
 * @param targetFiber Fiber
 * @returns 方法的集合
 */
export function accumulateSinglePhaseListeners(targetFiber: Fiber, reactName: string): Array<any> {
    let fiber: Fiber|null = targetFiber;
    const listeners:Array<DispatchListener> = [];
    while(fiber){
        const {pendingProps, tag} = fiber;
        if(tag === HostComponent){
            const lisener = pendingProps[reactName];
            if(typeof lisener === 'function'){
                listeners.push(createDispatchListener(fiber, lisener, fiber.stateNode));
            }
        }
        fiber = fiber.return;
    }
    return listeners;
}


/**
 * 执行事件
 * 按顺序处理事件队列中的事件
 * @param event 事件
 * @param listeners 事件冒泡的集合
 */
export function processEventQueueItemsInOrder(event: any, listeners: Array<any>) {
    for(let i = 0; i < listeners.length; i++){
        const {listener, currentTarget, fiber} = listeners[i];
        event.currentTarget = currentTarget;
        listener(event);
        event.currentTarget = null;
        if(event.isPropagationStopped()){
            return;
        }
    }
}

/**
 * 监听所有支持的事件
 * @param rootContainerElement 根元素
 */
export function listenToAllSupportedEvents(rootContainerElement: EventTarget){
    topLevelEventsToReactNames.forEach((nativeEvent, reactName) => {
        // 根元素添加事件监听，当捕获到事件触发时，找到event.target对应的fiber，执行fiber对应的方法
        rootContainerElement.addEventListener(nativeEvent, (e) => {
            const listeners = accumulateSinglePhaseListeners((e.target as any)[internalInstanceKey], reactName);
            const syntheticEvent = createSyntheticEvent(e);
            processEventQueueItemsInOrder(syntheticEvent, listeners);
        })
    })
}

