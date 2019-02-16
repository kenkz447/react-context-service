import * as React from 'react';
declare type ContextProviderProps<T = {}> = {
    initContextValue: T;
    context?: React.Context<T>;
    loggingEnabled?: boolean;
};
declare type ProviderState = Required<WithContextProps>;
declare type SetContext<T> = (context: Partial<T>) => void;
declare type GetContext<P> = (...key: Array<keyof P>) => Pick<P, keyof P>;
export declare type WithContextProps<T = {}, OwnProps = {}> = T & OwnProps & {
    setContext: SetContext<T>;
    getContext: GetContext<T>;
};
export declare class ContextCreator extends React.Component<ContextProviderProps> {
    static instance: ContextCreator;
    Context: React.Context<{}>;
    provider: Provider;
    constructor(props: ContextProviderProps);
    render(): JSX.Element;
}
interface ProviderProps {
    loggingEnabled?: boolean;
    initContextValue: {};
}
export declare class Provider extends React.Component<ProviderProps, ProviderState> {
    setContextProxy: (source: any, newContext: any) => void;
    getContext: (...contextKeys: any[]) => any;
    log: (source: any, newContext: any, oldContext: any) => void;
    constructor(props: ProviderProps);
    render(): JSX.Element;
}
export declare function withContext<C = {}, P = {}>(...keys: Array<keyof C>): <CP extends React.ComponentType<P & C & {
    setContext: SetContext<C>;
    getContext: GetContext<C>;
}>>(Component: CP) => {
    new (props: Readonly<P>): {
        render(): JSX.Element;
        renderConsumer: (context: any) => JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<P>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    new (props: P, context?: any): {
        render(): JSX.Element;
        renderConsumer: (context: any) => JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<P>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextType?: React.Context<any> | undefined;
};
export interface ContextRenderProps<C> {
    keys: Array<keyof C>;
    children: (x: WithContextProps<C>) => React.ReactNode;
}
export declare class ContextRender<C> extends React.PureComponent<ContextRenderProps<C>> {
    render(): JSX.Element;
    renderConsumer: (context: any) => React.ReactNode;
}
export {};
