import { UtilCocos } from '../../../../../app/base/utils/UtilCocos';
import { UtilNum } from '../../../../../app/base/utils/UtilNum';
import { RES_ENUM } from '../../../../const/ResPath';

const { ccclass, property } = cc._decorator;

@ccclass
export class RoleMartialItem extends cc.Component {
    @property(cc.Label)
    private LabName: cc.Label = null;

    @property(cc.Label)
    private LabLevel: cc.Label = null;

    @property(cc.Node)
    private NdLock: cc.Node[] = [];

    @property(cc.Sprite)
    private SpIcon: cc.Sprite = null;

    @property(cc.Sprite)
    private SpBack: cc.Sprite = null;

    @property(cc.SpriteFrame)
    private SfBacks: cc.SpriteFrame[] = [];

    public setIcon(iconId: number): void {
        UtilCocos.LoadSpriteFrame(this.SpIcon, `${RES_ENUM.Roleskill_Img_Wy}${UtilNum.FillZero(iconId + 1, 2)}_h`);
    }

    public setLock(lock: boolean): void {
        for (let i = 0; i < this.NdLock.length; ++i) { this.NdLock[i].active = lock; }
    }

    public setSelect(isSel: boolean): void {
        this.SpBack.spriteFrame = this.SfBacks[isSel ? 1 : 0];
    }

    public setQuality(color: string): void {
        this.LabName.node.color = this.LabName.node.color.fromHEX(color);
    }

    public setData(name: string, level: string): void {
        this.LabName.string = name;
        this.LabLevel.string = level;
    }
}
