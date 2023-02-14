let __id: number = 0;
/** 自增id */
const ID = () => ++__id;

export enum ENet {
    Success = ID(),
    Fail = ID(),
}

export const EUpdate = {
    /** 更新完成 */
    Success: ID(),
    /** 更新错误 */
    Error: ID(),
    /** 更新失败 */
    Fail: ID(),
};
