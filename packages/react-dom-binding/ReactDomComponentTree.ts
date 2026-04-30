import type { Fiber } from "packages/reconciler/ReactInternalTyes.js";
import type { Instance } from "./FiberConfigDOM.js";

/**
 * DOM和Fiber之间关联的工具类
 */
// 属性的唯一性----随机字符串
let randomKey = Math.random().toString(36).slice(2);
export let internalInstanceKey = '__reactFiber$' + randomKey;


/**
 * 关联dom节点之间的关系
 * @param fiber
 * @param instance
 */
export function precacheFiberNode(fiber: Fiber, instance: Instance){
    (instance as any)[internalInstanceKey] = fiber;
}


