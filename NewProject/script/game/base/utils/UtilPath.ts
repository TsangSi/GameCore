import { RES_ENUM } from '../../const/ResPath';

/** 获取各目录图片路径 */
export class UtilPath {
    /** 根据排行榜 1 2 3 获取排行榜图片路径 */
    /** n = 1 2 3 */
    public static rankPath(n: number): string {
        return `${RES_ENUM.Com_Img_Com_Img_Paiming_0}${n}`;
    }

    //
    //
    //
}
