import { scheduleMicroTask } from "packages/react-dom-binding/FiberConfigDOM.js";
import type { FiberRoot } from "./ReactInternalTyes.js";
import { performWorkOnRoot } from "./WorkLoop.js";
import { scheduleCallback } from "./Scheduler.js";

// 是否已经调度了微任务
let didScheduleMicroTask = false;

/**
 * 立即调度根节点调度任务--触发一个根节点的微任务
 */
function scheduleImmediatRootScheduleTask(){
      scheduleMicroTask(()=>{
        didScheduleMicroTask = false;
        scheduleCallback(()=>{
            performWorkOnRoot();
        });
      })
}

/**
 * 确认FiberRoot被调度
 * 触发一个微任务
 */
export function ensureRootIsScheduled(){
    if(!didScheduleMicroTask){
        didScheduleMicroTask = true;
        scheduleImmediatRootScheduleTask();
    }
}

