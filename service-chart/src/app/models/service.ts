import { ResponseModel } from './response-model';

export interface Service {
    title: string,
    intervalSeconds: number;
    notifyTimeout?: boolean;
    responses: ResponseModel[]
}
