import { appendChild } from "packages/react-dom-binding/FiberConfigDOM.js";
import type { Fiber } from "./ReactInternalTyes.js";


/**
 * 提交之突变副作用
 * 更新dom树
 * @param fiber hostRootFiber 
 */
export function commitMutaionEffects(fiber: Fiber){
    appendChild(fiber.stateNode.containerInfo, fiber.child?.stateNode);
}


