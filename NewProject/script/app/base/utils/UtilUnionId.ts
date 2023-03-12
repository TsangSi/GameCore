import { UtilNum } from './UtilNum';

export class UtilUnionId {
    /** 通过军衔 星级 部位 品质 等数据获取到装备唯一id（非onlyid） */
    /** 升星目标装备的唯一id 101 + 品质(1) + 军衔(2) + 星级(2)+ 部位(2)  总计十位数 */
    public static CreateEquipId(quality: number, reborn: number, star: number, part: number): string {
        return `101${quality}${UtilNum.FillZero(reborn, 2)}${UtilNum.FillZero(star, 2)}${UtilNum.FillZero(part, 2)}`;
    }
    public static CreateUpStarKey(ArmyLevel: number, ArmyStar: number): number {
        return Number(`${ArmyLevel}${ArmyStar}`);
    }
}