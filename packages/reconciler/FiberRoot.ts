import type { FiberRoot } from "./ReactInternalTyes.js";

export function createFiberRoot(containerInfo: HTMLElement): FiberRoot{
    const root: FiberRoot = {
        containerInfo
    }
    return root
}

