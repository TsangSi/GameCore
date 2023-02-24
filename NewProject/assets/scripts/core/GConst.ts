
export type TFunc = (...args: any[])=> void;
export type RecordTT<K extends number | string, V> = Record<K, V>
export type RecordNT<T> = RecordTT<number, T>
export type RecordNN = RecordNT<number>
export type RecordNS = RecordNT<string>
export type RecordNB = RecordNT<boolean>
export type RecordNA = RecordNT<any>
// export type RecordNObj = RecordNT<RecordTT<any, any>>

export type RecordST<T> = RecordTT<string, T>
export type RecordSN = RecordST<number>
export type RecordSS = RecordST<string>
export type RecordSB = RecordST<boolean>
export type RecordSA = RecordST<any>

export type RecordObj = RecordST<RecordST<any>>