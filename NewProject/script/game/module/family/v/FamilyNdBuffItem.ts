const { ccclass, property } = cc._decorator;

@ccclass
export class FamilyNdBuffItem extends cc.Component {
    @property(cc.Label)// 派遣时间
    private LabKey: cc.Label = null;
    @property(cc.Label)// 派遣时间
    private LabVal: cc.Label = null;

    public setData(k: string, v: string): void {
        this.LabKey.string = k;
        this.LabVal.string = v;
    }
}
