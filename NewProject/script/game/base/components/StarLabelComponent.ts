const { ccclass, property } = cc._decorator;

enum StarLayoutDirection {
    horizontal = 0,
    vertical = 1
}

@ccclass
export class StarLabelComponent extends cc.Label {
    @property({
        tooltip: '类型 默认:星星false, 其他:true',
        displayName: 'StarType',
    })
    private type: boolean = false;

    @property({
        tooltip: '排版方向 ,横向 竖向',
        type: cc.Enum(StarLayoutDirection),
    })
    private layoutDirection: StarLayoutDirection = StarLayoutDirection.horizontal;

    @property({
        tooltip: '显示的最大星星数量',
    })
    private maxCount: number = 10;

    private historyStarNum: number = 0;

    // 升星组件增加扩展  字节需要与font内相同
    @property
    private chars: string = 'ABCDEFGHIJKLMNOPabcdefghijklmnop';
    private effectIDs: string[] = ['8077', '8078', '8079', '8080', '8005'];

    /**
     * 星星显示
     * @param stars user星星数量
     * @param effect 是否显示升星特效
     */
    public updateStars(stars: number = 0, effect: boolean = false): void {
        const distance = stars - this.historyStarNum;
        let text = '';
        if (this.type) {
            text = this.swordUI(stars);
        } else {
            text = this.starUI(stars);
        }
        this.string = text;

        if (effect) {
            const positionsX: number[] = [];
            const positionsY: number[] = [];
            const labelWidth = this.node.width;
            const labelHeight = this.node.height;
            for (let i = 0; i < this.maxCount; i++) {
                const charWidth = (labelWidth - (this.maxCount - 1) * this.spacingX) / this.maxCount;
                const x = charWidth / 2 + i * (charWidth + this.spacingX) - labelWidth / 2;
                positionsX.push(x);
                // 因为最终多了一个回车所以要减去
                const y = this.lineHeight / 2 + i * this.lineHeight - labelHeight / 2 + this.lineHeight;
                positionsY.unshift(y);
            }

            if (distance >= this.maxCount) {
                // 所有地方都要播放特效
                for (let i = 0; i < this.maxCount; i++) {
                    if (this.type) {
                        this.playEffect(this.effectIDs[this.effectIDs.length - 1], i, positionsX, positionsY);
                    } else {
                        const starLevel = Math.floor(stars / this.maxCount);
                        let idx = Math.floor(starLevel / 7);
                        idx = idx > 3 ? 3 : idx;
                        this.playEffect(this.effectIDs[idx], i, positionsX, positionsY);
                    }
                }
            } else {
                for (let i = 0; i < distance; i++) {
                    const newLightIndex = this.historyStarNum % this.maxCount;
                    if (this.type) {
                        this.playEffect(this.effectIDs[this.effectIDs.length - 1], newLightIndex, positionsX, positionsY);
                    } else {
                        const starLevel = Math.floor(stars / this.maxCount);
                        let idx = Math.floor(starLevel / 7);
                        idx = idx > 3 ? 3 : idx;
                        this.playEffect(this.effectIDs[idx], newLightIndex, positionsX, positionsY);
                    }
                    this.historyStarNum += 1;
                }
            }
        }
        this.historyStarNum = stars;
    }

    private playEffect(effectID: string, index: number, posXs: number[], posYs: number[]) {
        this.loadEffect(effectID, (effNd: cc.Node) => {
            const pos = this.layoutDirection === StarLayoutDirection.vertical ? cc.v2(0, posYs[index]) : cc.v2(posXs[index], 0);
            effNd.setPosition(pos);
            this.node.addChild(effNd);
            const anim = effNd.getChildByName('Sprite').getComponent(cc.Animation);
            if (anim) {
                anim.play();
                anim.on(cc.Animation.EventType.FINISHED, () => {
                    effNd.destroy();
                });
            }
        });
    }

    private swordUI(stars: number) {
        const starLight = Math.floor(stars % this.maxCount);
        let text = '';
        for (let i = 0; i < this.maxCount; i++) {
            const charGary = '0';
            const charLight = '1';
            let c = '';
            if (starLight === 0 && stars > 0) {
                c += charLight;
            } else {
                c = i >= starLight ? charGary : charLight;
            }
            if (this.layoutDirection === StarLayoutDirection.vertical) {
                c += '\n';
            }
            text += c;
        }
        return text;
    }

    private starUI(stars: number) {
        let starLevel = Math.floor(stars / this.maxCount);
        const starLight = Math.floor(stars % this.maxCount);
        let nextLevel = starLevel + 1;
        starLevel = starLevel >= this.chars.length ? this.chars.length - 1 : starLevel;
        nextLevel = nextLevel >= this.chars.length ? this.chars.length - 1 : nextLevel;
        let text = '';
        for (let i = 0; i < this.maxCount; i++) {
            const charGary = this.chars.charAt(starLevel);
            const charLight = this.chars.charAt(nextLevel);
            let c = i >= starLight ? charGary : charLight;
            if (this.layoutDirection === StarLayoutDirection.vertical) {
                c += '\n';
            }
            text += c;
        }
        return text;
    }

    private loadEffect(effectID: string, loaded: (node: cc.Node) => void) {
        const path = `Effects/${effectID}`;
        cc.resources.load(path, cc.Prefab, (err, fab: cc.Prefab) => {
            if (!err) {
                const effNd = cc.instantiate(fab);
                loaded(effNd);
            } else {
                console.error('star effect load err ,meeeage:', err);
            }
        });
    }
}
