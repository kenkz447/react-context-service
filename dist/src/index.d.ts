import * as React from 'react';
declare type ContextProviderProps<P = {}> = {
    value: P;
};
declare type ReactContructor<P = {}> = new (props: P) => React.Component<P>;
declare type ProviderState = Required<ContextProps>;
declare type SubscribeCallback<T = {}> = (context: T) => void;
declare type SetContext = <T>(context: T) => void;
declare type GetContext = <P>(...key: Array<keyof P>) => Pick<P, keyof P>;
export interface ContextProps {
    setContext?: SetContext;
    getContext?: GetContext;
}
export declare class ContextCreator extends React.Component<ContextProviderProps> {
    static instance: ContextCreator;
    Context: React.Context<ContextProviderProps['value']>;
    provider: Provider;
    constructor(props: ContextProviderProps);
    render(): JSX.Element;
}
interface ProviderProps {
    value: any;
}
export declare class Provider extends React.Component<ProviderProps, ProviderState> {
    static subscribeStack: Array<SubscribeCallback<any>>;
    constructor(props: any);
    render(): JSX.Element;
}
export declare function withContext<P extends ContextProps>(...keys: Array<keyof P>): (Component: ReactContructor<P>) => {
    new (props: P): {
        consumberRef: React.RefObject<React.Component<P, {}, any>>;
        render(): JSX.Element;
        renderConsumer: (context: any) => JSX.Element;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<P>;
        state: Readonly<{}>;
        context: any;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
};
export {};
