import { createFiber, createFiberFromElement, createFiberFromTypeAndProps } from "../Fiber.js";
import { HostComponent } from "../ReactInternalTyes.js";
import type { ReactElement } from "shared/ReactElementType.js";

describe('Fiber测试', ()=>{

    test('测试createFiber有key', ()=>{
        const tag = HostComponent;
        const key = 'test-key';
        const fiber = createFiber(tag, key)
        expect(fiber.tag).toBe(tag)
        expect(fiber.key).toBe(key)
        expect(fiber.elementType).toBeNull()
        expect(fiber.type).toBeNull()
        expect(fiber.stateNode).toBeNull()
        expect(fiber.return).toBeNull()
        expect(fiber.child).toBeNull()
        expect(fiber.sibling).toBeNull()
        expect(fiber.ref).toBeNull()
    })

    test('测试createFiber没有key', ()=>{
        const tag = HostComponent;
        const fiber = createFiber(tag, null);
        expect(fiber.tag).toBe(tag);
        expect(fiber.key).toBeNull();
    })

    test('测试createFiberFromTypeAndProps', ()=>{
        const type = 'div'
        const key = 'test-key'
        const fiber = createFiberFromTypeAndProps(type, null, key)
        expect(fiber.tag).toBe(HostComponent)
        expect(fiber.key).toBe(key)
        expect(fiber.elementType).toBe(type)
        expect(fiber.type).toBe(type)

    })

    test('测试createFiberFromElement', ()=>{
        const element:ReactElement = {
            $$typeof: Symbol.for('du1React'),
            type: 'div',
            key: 'test-key',
            props: {},
            ref: null
        }
        const fiber = createFiberFromElement(element)
        expect(fiber.tag).toBe(HostComponent)
        expect(fiber.key).toBe(element.key)
        expect(fiber.elementType).toBe(element.type)
        expect(fiber.type).toBe(element.type)
    })
})

