/*
 * @Author: zs
 * @Date: 2022-11-18 11:22:42
 * @FilePath: \SanGuo2.4-main\assets\script\game\module\material\v\team\com\TeamTypeItem.ts
 * @Description:
 *
 */
import { UtilCocos } from '../../../../../../app/base/utils/UtilCocos';
import BaseCmp from '../../../../../../app/core/mvc/view/BaseCmp';
import { ResMgr } from '../../../../../../app/core/res/ResMgr';
import { SpriteCustomizer } from '../../../../../base/components/SpriteCustomizer';
import { RES_ENUM } from '../../../../../const/ResPath';
import { EntityUnitType } from '../../../../../entity/EntityConst';

enum ETeamFBType {
    /** 红颜 */
    Beauty = 1,
    /** 武将 */
    General = 2,
}
const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
export class TeamTypeItem extends BaseCmp {
    @property({ serializable: true })
    private _Icon: cc.Sprite = null;
    @property(cc.Sprite)
    private set Icon(s) {
        this._Icon = s;
        this.updateSpriteIcon();
    }
    private get Icon(): cc.Sprite {
        return this._Icon;
    }

    private _fbType: ETeamFBType = ETeamFBType.Beauty;
    public get fbType(): ETeamFBType {
        return this._fbType;
    }
    @property({
        type: cc.Enum(ETeamFBType),
        tooltip: CC_DEV && 'General：武将，Beauty：红颜',
    })
    public set fbType(type: ETeamFBType) {
        if (this._fbType === type) {
            return;
        }
        this._fbType = type;
        this.updateSpriteIcon();
    }

    private _select: boolean = false;
    @property(cc.Boolean)
    public set select(b: boolean) {
        if (this._select === b) {
            return;
        }
        this._select = b;
        this.updateSpriteIcon();
    }
    public get select(): boolean {
        return this._select;
    }

    private updateSpriteIcon() {
        if (!this.Icon) { return; }
        const path: string = this._select ? `${RES_ENUM.Team_Btn_Zd}${this._fbType}_01@ML` : `${RES_ENUM.Team_Btn_Zd}${this._fbType}_02@ML`;
        UtilCocos.LoadSpriteFrame(this.Icon, path);
    }
}
