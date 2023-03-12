/*
 * @Author: zs
 * @Date: 2022-05-09 21:13:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-01-30 16:03:57
 * @FilePath: \SanGuo\assets\script\game\module\role\RoleD.ts
 * @Description:
 *
 */

import { RoleMD } from './RoleMD';

export interface RoleAttrDataA {
    A: IntAttr[],
}
export interface RoleAttrDataB {
    B: StrAttr[]
}
export interface RoleAttrData extends RoleAttrDataA, RoleAttrDataB {
}

/**
 * 该类对自动生成的RoleMD类做扩展
 * 如果有需求，可以在该类下加额外属性
 */
export class RoleD extends RoleMD {
    public constructor(data?: RoleAttrDataA);
    public constructor(data?: RoleAttrDataB);
    public constructor(data?: { A: IntAttr[], B: StrAttr[] });
    public constructor(data?: RoleAttrData) {
        super();
        if (data) {
            this.setData(data);
        }
    }

    public setData(data: RoleAttrData): void {
        if (data) {
            if (data.A !== null && data.A !== undefined) {
                let key: string;
                data.A.forEach((element) => {
                    if (element.V != null) {
                        key = RoleMD.AttrType[element.K] as string;
                        this[key] = +element.V;
                    }
                });
            }

            if (data.B != null && data.A !== undefined) {
                let key: string;
                data.B.forEach((element) => {
                    if (element.V != null) {
                        key = RoleMD.AttrType[element.K] as string;
                        this[key] = element.V;
                    }
                });
            }
        }
    }

    /**
     * 更新单个属性
     * @param attrKey 属性字符串
     * @param value 属性值
     */
    public updateAttr(attrKey: string, value: number | string): boolean {
        const oldValue = this[attrKey];
        if (value === undefined || value === null || value === oldValue) {
            return false;
        }
        this[attrKey] = value;
        return true;
    }

    public getArrtValueByKey(key: number): any {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return this[RoleMD.AttrType[key]];
    }
}
