export class MaxRects {
    private width: number = 0;
    private height: number = 0;
    private padding: number = 0;
    private border: number = 0;
    private freeRects: cc.Rect[] = [];
    private rects: cc.Rect[] = [];

    public constructor(maxWidth: number, maxHeight: number, padding: number, border: number) {
        this.width = maxWidth;
        this.height = maxHeight;
        this.padding = padding;
        this.border = border;
        this.freeRects.push(new cc.Rect(
            this.border,
            this.border,
            this.width + this.padding - this.border * 2,
            this.height + this.padding - this.border * 2,
        ));
        this.rects = [];
    }

    /** 重置 */
    public reset(): void {
        this.freeRects = [];
        this.rects = [];
    }

    public add(width: number, height: number): cc.Rect {
        const rect = new cc.Rect(0, 0, width, height);
        const result = this.placeRect(rect);
        if (result) {
            this.rects.push(result);
        }
        return result;
    }

    private placeRect(rect: cc.Rect): cc.Rect {
        const node = this.findNode(rect.width + this.padding, rect.height + this.padding);
        if (node) {
            let numFreeRects = this.freeRects.length;
            let i = 0;
            while (i < numFreeRects) {
                if (this.splitNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    numFreeRects--;
                    i--;
                }
                i++;
            }
            this.pruneFreeList();
            rect.x = node.x;
            rect.y = node.y;
            return rect;
        }
        return undefined;
    }

    private findNode(width: number, height: number): cc.Rect {
        let score = Number.MAX_VALUE;
        let areaFit = 0;
        let bestNode: cc.Rect = null;
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const i in this.freeRects) {
            const rect = this.freeRects[i];
            if (rect.width >= width && rect.height >= height) {
                areaFit = rect.width * rect.height - width * height;
                if (areaFit < score) {
                    bestNode = new cc.Rect(rect.x, rect.y, width, height);
                    score = areaFit;
                }
            }
        }
        return bestNode;
    }

    private splitNode(freeRect: cc.Rect, usedNode: cc.Rect) {
        if (!freeRect.intersects(usedNode)) return false;

        // Do vertical split
        if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
            // New node at the top side of the used node
            if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
                const newNode = new cc.Rect(freeRect.x, freeRect.y, freeRect.width, usedNode.y - freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the bottom side of the used node
            if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
                const newNode = new cc.Rect(
                    freeRect.x,
                    usedNode.y + usedNode.height,
                    freeRect.width,
                    freeRect.y + freeRect.height - (usedNode.y + usedNode.height),
                );
                this.freeRects.push(newNode);
            }
        }

        // Do Horizontal split
        if (usedNode.y < freeRect.y + freeRect.height
            && usedNode.y + usedNode.height > freeRect.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
                const newNode = new cc.Rect(freeRect.x, freeRect.y, usedNode.x - freeRect.x, freeRect.height);
                this.freeRects.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
                const newNode = new cc.Rect(
                    usedNode.x + usedNode.width,
                    freeRect.y,
                    freeRect.x + freeRect.width - (usedNode.x + usedNode.width),
                    freeRect.height,
                );
                this.freeRects.push(newNode);
            }
        }
        return true;
    }

    private pruneFreeList() {
        // Go through each pair of freeRects and remove any rects that is redundant
        let i = 0;
        let j = 0;
        let len = this.freeRects.length;
        while (i < len) {
            j = i + 1;
            const tmpRect1 = this.freeRects[i];
            while (j < len) {
                const tmpRect2 = this.freeRects[j];
                if (tmpRect2.containsRect(tmpRect1)) {
                    this.freeRects.splice(i, 1);
                    i--;
                    len--;
                    break;
                }
                if (tmpRect1.containsRect(tmpRect2)) {
                    this.freeRects.splice(j, 1);
                    j--;
                    len--;
                }
                j++;
            }
            i++;
        }
    }
}
