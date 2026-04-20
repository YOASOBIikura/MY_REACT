/*
import { jsx } from "../jsx-runtime.js";

describe('jsx函数测试', ()=>{

    test('标准元素', () => { 
        const element = jsx('div', {class: 'container', id: 'div1'}, 'key1');
        expect(element).toEqual({
            $$typeof: typeof Symbol === 'function' && Symbol.for ? Symbol.for('du1React') : 'du1React',
            type: 'div',
            props: { class: 'container', id: 'div1' },
            key: 'key1',
            ref: null
        })
     })


     test('没有key的情况', ()=>{
        const element = jsx('span', {children: 'hello'});
        expect(element.key).toBeNull();
        expect(element.type).toBe('span');
        expect(element.props).toEqual({children: 'hello'});
     })

     test('props中有key的情况', ()=>{
        const props = { id: 'div1', key: 'key1' }
        const element = jsx('div', {...props})
        expect(element.key).toBe('key1')
        expect(element.props).toEqual({ id: 'div1' })
     })

     test('ref的情况', ()=>{
        const ref = {};
        const element = jsx('div', {ref})
        expect(element.ref).toBe(ref)
     })

})
*/

import { jsx } from "../jsx-runtime.js";

describe("jsx runtime", () => {
    test("standard element", () => {
        const element = jsx("div", { class: "container", id: "div1" }, "key1");

        expect(element).toEqual({
            $$typeof: typeof Symbol === "function" && Symbol.for ? Symbol.for("du1React") : "du1React",
            type: "div",
            props: { class: "container", id: "div1" },
            key: "key1",
            ref: null
        });
    });

    test("without key", () => {
        const element = jsx("span", { children: "hello" });

        expect(element.key).toBeNull();
        expect(element.type).toBe("span");
        expect(element.props).toEqual({ children: "hello" });
    });

    test("key from props", () => {
        const props = { id: "div1", key: "key1" };
        const element = jsx("div", { ...props });

        expect(element.key).toBe("key1");
        expect(element.props).toEqual({ id: "div1" });
    });

    test("ref support", () => {
        const ref = {};
        const element = jsx("div", { ref });

        expect(element.ref).toBe(ref);
        expect(element.props).toEqual({});
    });
});
