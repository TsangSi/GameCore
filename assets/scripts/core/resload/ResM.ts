import BaseSigleton from '../mvc/Mgr';

export class ResM extends BaseSigleton<ResM> {
    //
    public test(): void {
        console.log('111');
    }
}
