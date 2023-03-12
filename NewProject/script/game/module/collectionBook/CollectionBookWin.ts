/*
 * @Author: zs
 * @Date: 2022-12-01 17:42:29
 * @FilePath: \SanGuo-2.4-main\assets\script\game\module\collectionBook\CollectionBookWin.ts
 * @Description:
 *
 */
import { IWinTabData } from '../../../app/core/mvc/WinConst';
import WinTabFrame from '../../com/win/WinTabFrame';
import { FuncId } from '../../const/FuncConst';
import { FuncDescConst } from '../../const/FuncDescConst';
import { TabBtnId } from '../../const/TabBtnConst';
import { UI_PATH_ENUM } from '../../const/UIPath';
import { RID } from '../reddot/RedDotConst';
import { ECollectionBookTabId } from './CollectionBookConst';

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectionBookWin extends WinTabFrame {
    public getTabData(): IWinTabData[] {
        const tabDataArr: IWinTabData[] = [
            {
                TabId: ECollectionBookTabId.Info,
                className: 'CollectionBookInfo',
                prefabPath: UI_PATH_ENUM.CollectionBookInfo,
                funcId: FuncId.CollectionBook,
                redId: RID.More.CollectionBook.Task,
                descId: FuncDescConst.CollectionBook,
            },
            {
                TabId: ECollectionBookTabId.Career,
                className: 'CollectionBookCareer',
                prefabPath: UI_PATH_ENUM.CollectionBookCareer,

                redId: RID.More.CollectionBook.Career,
                funcId: FuncId.CollectionBookCareer,
                descId: FuncDescConst.CollectionBook,
            },
            {
                TabId: ECollectionBookTabId.Person,
                className: 'CollectionBookPerson',
                prefabPath: UI_PATH_ENUM.CollectionBookPerson,

                redId: RID.More.CollectionBook.Person.Base,
                funcId: FuncId.CollectionBookPerson,
                descId: FuncDescConst.CollectionBook,
            },
            {
                TabId: ECollectionBookTabId.Wonder,
                className: 'CollectionBookPerson',
                prefabPath: UI_PATH_ENUM.CollectionBookPerson,

                redId: RID.More.CollectionBook.Wonder.Base,
                funcId: FuncId.CollectionBookWonder,
                descId: FuncDescConst.CollectionBook,
            },

        ];
        return tabDataArr;
    }
    public initWin(...param: unknown[]): void {
        // throw new Error('Method not implemented.');
    }
}
