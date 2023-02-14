class LinkNode {
    public value;
    public next: LinkNode;
    public constructor(value?) {
        this.value = value;
    }
}
export class LinkedList {
    private length = 0;
    private head: LinkNode = null;
    private currNode: LinkNode = null;

    public constructor() {
        this.head = new LinkNode('head');
    }

    /**
     * 判断单链表是否为空
     * @returns
     */
    public isEmpty(): boolean {
        return this.length === 0;
    }

    /** 在单链表中寻找value元素 */
    public find(value: unknown): LinkNode {
        let currNode = this.head;
        while (currNode && (currNode.value !== value)) {
            currNode = currNode.next;
        }
        return currNode;
    }

    /** 找到最后一个元素 */
    public findLast(): LinkNode {
        let currNode = this.head;
        while (currNode.next) {
            currNode = currNode.next;
        }
        return currNode;
    }

    /** 从当前位置向前移动 n 个节点 */
    public advance(n: number, currNode?: LinkNode): LinkNode {
        this.currNode = currNode || this.head;
        while (n-- && this.currNode.next) {
            this.currNode = this.currNode.next;
        }
        return this.currNode;
    }

    /** 在尾部添加元素 */
    public append(value: unknown): void {
        const link = new LinkNode(value);
        const currNode = this.findLast();
        currNode.next = link;
        this.length++;
    }

    /**
     * 根据已有元素在后面插入元素
     * @param item 已有元素
     * @param value
     * @returns
     */
     public insertByValue(value: unknown, newValue: unknown): boolean {
        const itemNode = this.find(value);
        if (!itemNode) { // 如果item元素不存在
            return false;
        }
        const newNode = new LinkNode(newValue);

        newNode.next = itemNode.next; // 若currNode为最后一个节点，则currNode.next为空
        itemNode.next = newNode;
        this.length++;
        return true;
    }

    /**
     * 根据位置向单链表中插入元素
     * @param pos 位置
     * @param value 元素
     * @returns
     */
     public insertByPos(pos: number, value: unknown): boolean {
        if (pos >= 0 && pos <= this.length) {
            const link = new LinkNode(value);
            let current = this.head;
            if (pos === 0) {
                link.next = current;
                this.head = link;
            } else {
                let index = 0;
                let previous: LinkNode;
                while (index++ < pos) {
                    previous = current;
                    current = current.next;
                }
                link.next = current;
                previous.next = link;
            }
            this.length++;
            return true;
        } else {
            return false;
        }
    }

    /**
     * 在单链表中删除一个节点
     * @param value 已有元素值
     * @returns
     */
     public remove(value: unknown): void {
        if (!this.find(value)) { // item元素在单链表中不存在时
            return;
        }
        // 企图删除头结点
        if (value === 'head') {
            if (!this.isEmpty()) {
                return;
            } else {
                this.head.next = null;
                return;
            }
        }
        let currNode = this.head;
        while (currNode.next.value !== value) {
            // 企图删除不存在的节点
            if (!currNode.next) {
                return;
            }
            currNode = currNode.next;
        }
        currNode.next = currNode.next.next;
        this.length--;
    }

    public getHead(): LinkNode {
        return this.head;
    }

    public size(): number {
        return this.length;
    }

    // 清空单链表
    public clear(): void {
        this.head.next = null;
        this.length = 0;
    }
}
