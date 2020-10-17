import React from 'react';
import { FormCallback, List } from '@libreform/libreform/dist/types';
declare function Loading({ form }: {
    form: string | number;
}): JSX.Element;
declare function Errors({ data }: {
    data: Error;
}): JSX.Element;
interface ReferrerData {
    type: string;
    url: string;
    id?: number;
    title?: string;
}
declare function LibreForm({ form, className, ref, referrerData, WhileLoading, IfErrors, callbacks, }: {
    form: string | number;
    className?: string;
    ref?: React.MutableRefObject<HTMLDivElement>;
    referrerData?: ReferrerData;
    IfErrors?: typeof Errors;
    WhileLoading?: typeof Loading;
    callbacks?: {
        [x: string]: List<FormCallback>;
    };
}): JSX.Element;
export default LibreForm;
