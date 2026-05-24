import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols.js";
import { createFiber, createFiberFromElement, createFiberFromText, createWorkInProgress } from "./Fiber.js";
import { HostText, type Fiber } from "./ReactInternalTyes.js";
import { ChildDeletion, Placement } from "./FiberFlags.js";


/**
 * 删除当前元素
 * 1. 打删除标记（首次）
 * 2. 存储要删除的子节点
 * @param returnFiber 
 * @param childToDelete 
 * @returns 
 */
function deleteChild(returnFiber:Fiber, childToDelete: Fiber){
    const deletions = returnFiber.deletions;
    if(deletions === null){
        returnFiber.deletions = [childToDelete];
        returnFiber.flags |= ChildDeletion
    }else{
        deletions.push(childToDelete);
    }
}

/**
 * 删除其余元素
 * @param returnFiber 
 * @param childrenToDelete 
 * @returns 
 */
function deleteRemainingChildren(returnFiber: Fiber, childrenToDelete: Fiber|null){
    let childToDelete = childrenToDelete;
    while(childToDelete !== null){
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
    }
}

/**
 * 给单一子节点打place标记
 * @param newFiber 
 * @returns newFiber
 */
function placeSingleChild(newFiber: Fiber){
    if(newFiber.alternate === null){
        newFiber.flags |= Placement
    }
    return newFiber;
}

// 创建单一子节点，返回子节点
function reconcileSingleElement(returnFiber: any, children:any):Fiber{
    const key = children.key;
    let child = returnFiber.alternate?.child;
    // 遍历旧节点，进行对比
    while(child){
        if(child.key === key){
            const elementType = children.type;
            if(elementType === child.type){
                const existing = createWorkInProgress(child, children.props);
                existing.return = returnFiber;
                existing.index = 0;
                // 删除其余元素
                deleteRemainingChildren(returnFiber, child.sibling);
                return existing;
            }else{
                // 删除其余元素
                deleteRemainingChildren(returnFiber, child);
                break;
            }
        }else{
            // 删除当前元素
            deleteChild(returnFiber, child);
        }
        child = child.sibling;
    }
    // 创建新节点
    const created = createFiberFromElement(children);
    created.return = returnFiber;
    created.flags |= Placement;
    return created;
}

/**
 * 更新文本节点
 * @param returnFiber 
 * @param oldFiber 
 * @param newChild
 * @returns Fiber 
 */
function updateTextNode(returnFiber: Fiber, oldFiber: Fiber|null, textContent: string): Fiber {
    // 如果旧节点为空，或者旧节点不是文本节点，就创建否则复用
    if(oldFiber === null || oldFiber.tag !== HostText){
        const created = createFiberFromText(textContent);
        created.return = returnFiber;
        return created;
    }else{
        const existing = createWorkInProgress(oldFiber, textContent);
        existing.return = returnFiber;
        return existing;
    }
}

/**
 * 更新ReactElement
 * @param returnFiber 
 * @param oldFiber 
 * @param element 
 * @returns Fiber
 */
function updateElement(returnFiber: Fiber, oldFiber: Fiber|null, element: any): Fiber {
    // 获取创建的元素类型
    const elementType = element.type;
    // 判断旧节点是否存在
    if(oldFiber !== null){
        // 判断旧节点是否可以复用
        if(oldFiber.elementType === elementType){
            // 更新元素节点
            const existing = createWorkInProgress(oldFiber, element);
            existing.return = returnFiber;
            return existing;
        }
    }
    // 创建新节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
}

/**
 * 更新槽(更新投币口) 能否在当前位置进行元素更新
 * 判断我能否将构建的节点放到当前位置上，如果可以，就返回构建的节点，如果不行就返回null
 * @param returnFiber 
 * @param oldFiber
 * @param newChild
 * @returns Fiber | null
 */
function updateSlot(returnFiber: Fiber, oldFiber: Fiber, newChild: any): any {
    // 获取旧节点的key
    const key = oldFiber.key;
    // 如果更新节点是文本节点
    if(typeof newChild === 'string' || typeof newChild === 'number'){
        // 如果旧节点有key，则不能进行文本节点的更新
        if(key !== null){
            return null;
        }
        // 更新文本节点
        return updateTextNode(returnFiber, oldFiber, newChild as string);
    }
    // 如果新的节点是对象
    if(typeof newChild === 'object' && newChild !== null){
        switch(newChild.$$typeof){
            case REACT_ELEMENT_TYPE: {
                // 如果新节点的key和旧节点的key相同，则可以进行更新，否则返回null
                if(newChild.key === key){
                    // 更新元素节点
                    return updateElement(returnFiber, oldFiber, newChild);
                }else{
                    return null;
                }
            }
        }
    }
}

/**
 * 放置子节点--给子节点打标记
 * @param newFiber
 * @param lastPlacedIndex
 * @param newIndex
 * @returns
 */
function placeChild(newFiber: Fiber, lastPlaceIndex: number, newIndex: number): number {
    // 设置新节点的索引位
    newFiber.index = newIndex;
    // 获取旧节点
    const current = newFiber.alternate;
    // 判断旧节点是否存在，如果存在，则判断是否移动，不存在则插入
    if( current !== null){
        // 获取旧节点索引
        const oldIndex = current.index;
        // 判断旧节点索引是否小于lastPlaceIndex，如果小于则移动否则不移动
        if(oldIndex < lastPlaceIndex){
            // 移动，标记placement
            newFiber.flags |= Placement;
            return lastPlaceIndex
        }else{
            // 不移动
            return oldIndex;
        }
    }else{
        newFiber.flags |= Placement;
        return lastPlaceIndex; 
    }
}

/**
 * 将剩余节点添加到临时映射，以便快速查找
 * @param currentFirstChild 
 * @returns Map<string, Fiber>
 */
function mapRemainingChildren(currentFirstChild:Fiber|null): Map<string|number, Fiber>{
    // 创建一个Map
    const existingChildren = new Map();
    // 获取当前子节点
    let child = currentFirstChild;
    // 遍历子节点
    while(child !== null){
        // 将子节点添加到map
        existingChildren.set(child.key === null ? child.index : child.key, child);
        // 移动指针
        child = child.sibling;
    }
    // 返回map
    return existingChildren;
}


/**
 * 从映射中获取节点
 * @param existingChildren 
 * @param returnFiber 
 * @param newIdx 
 * @param newChild 
 * @returns Fiber
 */
function updateFromMap(existingChildren: Map<string|number, Fiber>, returnFiber: Fiber, newIdx: number, newChild: any): any{
    // 判断文本类型
    if(typeof newChild === 'string' || typeof newChild === 'number'){
        // 从map中获取节点
        const matchedFiber = existingChildren.get('' + newIdx) || null;
        return updateTextNode(returnFiber, matchedFiber, newChild as string);
    }
    // 判断对象类型
    if(typeof newChild === 'object' && newChild !== null){
        switch(newChild.$$typeof){
            case REACT_ELEMENT_TYPE: {
                // 从map中获取节点
                const matchedFiber: Fiber | null = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                return updateElement(returnFiber, matchedFiber, newChild);
            }
        }
    }
}

// 创建数组中所有子节点并建立他们之间的联系，返回第一个子节点
function reconcileChildrenArray(returnFiber: any, children:any):Fiber|null{
    // 第一个子节点
    let resultingFirstChild:Fiber | null = null;
    // 上一个新节点
    let previousNewFiber:Fiber | null = null;

    // current树上的第一个child
    let oldFiber: Fiber | null = returnFiber.alternate?.child || null;
    // 上一次插入的index，要对比的最新基准位 A->B => [B,A] => B->A
    let lastPlacedIndex = 0;
    // 新树的index
    let newIdx = 0;


    // 第一阶段：顺序比较，A->B->C => [A,B,C]，位置相同，且元素相同
    for(;oldFiber !== null && newIdx < children.length; newIdx++){
        // 判断节点是否在当前位置可以复用，可以则返回当前节点，不可以返回null
        const newFiber = updateSlot(returnFiber, oldFiber, children[newIdx]);
        // 如果不能复用，则跳出第一阶段
        if(newFiber === null){
            break;
        }
        // 如果可以复用，但key相同而type不同，则删除current树上的旧节点 A->B->C => [A',B,C]
        if(oldFiber && newFiber.alternate === null){
            deleteChild(returnFiber, oldFiber);
        }
        // 打标记
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

        // 构建新fiber链
        if(previousNewFiber === null){
            resultingFirstChild = newFiber;
        }else{
            previousNewFiber.sibling = newFiber;
        }
        // 移动指针
        previousNewFiber = newFiber;
        oldFiber = oldFiber?.sibling;
    }


    // 第二阶段：快速路径处理，新旧树长短不同，但同样长度上的元素相同
    //  情况一：新树比旧树短，A->B->C => [A,B]，删除current树上的其余子节点
    if(newIdx === children.length){
        deleteRemainingChildren(returnFiber, oldFiber);
        return resultingFirstChild;
    }
    //  情况二：新树比旧树长，A->B->C => [A,B,C,D], 剩余新树节点全部创建
    if(oldFiber === null){
         for(; newIdx < children.length; newIdx++){
            const newFiber = typeof children[newIdx] === 'string' || 
            typeof children[newIdx] === 'number' ? createFiberFromText(children) : createFiberFromElement(children[newIdx]);
            newFiber.return = returnFiber;
            // 打标记
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);

            if(previousNewFiber === null){
                resultingFirstChild = newFiber;
            }else{
                previousNewFiber.sibling = newFiber; 
            }
            previousNewFiber = newFiber;
        }
    }
    // 第三阶段：Map查找，前两个阶段无法处理的情况都在这个阶段处理，位置不同或完全不存在，A->B->C => [B,C,D,E]
    // 将旧树上剩余的fiber转成map
    const existingChildren = mapRemainingChildren(oldFiber);

    // 遍历剩余新节点，在map中查找是否可以复用，可以复用则更新，否则创建
    for(;newIdx < children.length; newIdx++){
        // 从map中获取节点
        const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, children[newIdx]);
        // 如果节点是复用的，就删除map中的节点
        if(newFiber.alternate !== null){
            existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
        }
        // 打标记
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 构建新的fiber链
        if(previousNewFiber === null){
            resultingFirstChild = newFiber;
        }else{
            previousNewFiber.sibling = newFiber;
        }
        // 移动指针
        previousNewFiber = newFiber;
    }

    // 对于map中剩余的fiebr全部标记删除
    existingChildren.forEach((child: Fiber) => deleteChild(returnFiber, child));

    return resultingFirstChild;
}

/**
 * 协调子节点，根据不同情况调用不同的逻辑
 * params:children
 * return:fiber
 */
export function reconcileChildFibers(fiber: Fiber, children:any):Fiber|null{

    // 单一子节点
    if(children.$$typeof === REACT_ELEMENT_TYPE){ 
        return placeSingleChild(reconcileSingleElement(fiber, children));
    }

    // 多子节点
    if(Array.isArray(children)){
        return reconcileChildrenArray(fiber, children);
    }


    return null;
}


