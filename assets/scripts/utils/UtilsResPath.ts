import { QualityType } from '../global/GConst';
import Utils from './Utils';

export class UtilsResPath {
    private static _i: UtilsResPath = null;
    public static get I(): UtilsResPath {
        if (this._i == null) {
            this._i = new UtilsResPath();
        }
        return this._i;
    }
    /**
     * 根据品质获取方形物品框资源路径
     * @param quality
     */
    public static getBorderImg(quality: number): string {
        let result = 'i/com/b/zbbg_';
        if (quality > QualityType.F) {
            result += 'fen';
            return result;
        }
        const list = ['', 'lv', 'lan', 'zi', 'cheng', 'hong', 'jin', 'cai', 'fen', 'fen', 'fen', 'fen'];
        result = list[quality] ? result + list[quality] : `${result}bai`;
        return result;
    }

    /** 获取boder特效id */
    public static getBodrEffectId(quality: QualityType): number {
        let resId = 0;
        switch (quality) {
            case QualityType.Z:
                resId = 6251;
                break;
            case QualityType.C:
                resId = 6252;
                break;
            case QualityType.R:
                resId = 6253;
                break;
            case QualityType.J:
                resId = 6254;
                break;
            case QualityType.Color:
                resId = 6255;
                break;
            case QualityType.F:
                resId = 6256;
                break;
            default:
                break;
    }
    return resId;
}

    /** 获取物品icon路径 */
    public static getItemIconPath(picID: string, postfix = ''): string {
        const skinId = Utils.getSkinId(picID, 1);
        return `i/m/bag/itIcon/${skinId}${postfix}`;
    }

    /**
     * 获取皮肤的S SR SSR SSSR
     * @param q 品质
     */
    public getSkinRarity(q: number): string {
        let strP = 'i/com/g/img_';
        strP += this.getSSR(q);
        return strP;
    }
    private raritys: string[] = ['', 'n', 'r', 'sr', 'ssr', 'sssr', 'xr', 'ur', 'fr'];
    private rarityLength = this.raritys.length - 1;
    public getSSR(q: number): string {
        if (q > this.rarityLength) {
            return this.raritys[this.rarityLength];
        } else {
            return this.raritys[q] ? this.raritys[q] : 'r';
        }
    }

    private petRaritys: string[] = ['', 'img_pet_putong', 'img_pet_jingying', 'img_pet_shishi', 'img_pet_chuanshuo', 'img_pet_shenhua'];
    /**
     * * 稀有标识资源路径
    */
   public getPetRarity(Rarity: number): string {
        const name = this.petRaritys[Rarity];
        if (name) {
            return `i/com/g/${name}`;
        }
        return '';
    }
}
