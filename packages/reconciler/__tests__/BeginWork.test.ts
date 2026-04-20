import { beginWork } from "../BeginWork.js";
import { SINGLE_ELEMENT } from "./data.js";
import { createFiberFromElement } from "../Fiber.js";

describe('beginWork测试', ()=>{
    test('单节点测试', ()=>{
        const root_fiber = createFiberFromElement(SINGLE_ELEMENT);
        const child_fiber = beginWork(root_fiber);
        expect(child_fiber?.type).toBe("p")
        expect(root_fiber.pendingProps).not.toBeNull();
        expect(child_fiber?.pendingProps).not.toBeNull();
        expect(child_fiber?.return).toBe(root_fiber);
        expect(root_fiber.child).toBe(child_fiber);
    })
})
