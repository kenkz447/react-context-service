import * as React from 'react';

type ContextProviderProps<T = {}> = {
    initContextValue: T;
    context?: React.Context<T>
    loggingEnabled?: boolean;
};

type ProviderState = Required<WithContextProps>;

type SetContext<T> = (context: Partial<T>) => void;
type GetContext<P> = (...key: Array<keyof P>) => Pick<P, keyof P>;

export type WithContextProps<T = {}, OwnProps = {}> = T & OwnProps & {
    setContext: SetContext<T>;
    getContext: GetContext<T>;
};

export class ContextCreator extends React.Component<ContextProviderProps> {
    static instance: ContextCreator;
    Context: React.Context<{}>;
    provider!: Provider;

    constructor(props: ContextProviderProps) {
        super(props);
        const { context, initContextValue } = this.props;
        this.Context = context || React.createContext(initContextValue);
        ContextCreator.instance = this;
    }

    render() {
        const {
            loggingEnabled,
            children,
            initContextValue
        } = this.props;

        return (
            <Provider
                ref={(e: Provider) => this.provider = e}
                initContextValue={initContextValue}
                loggingEnabled={loggingEnabled}
            >
                {children}
            </Provider>
        );
    }
}

interface ProviderProps {
    loggingEnabled?: boolean;
    initContextValue: {};
}

export class Provider extends React.Component<ProviderProps, ProviderState> {
    setContextProxy = (source, newContext) => {
        const { loggingEnabled } = this.props;
        const newContextKey = Object.keys(newContext);
        const oldContext = this.getContext(newContextKey);

        const setContextCallback = (() => {
            if (loggingEnabled) {
                this.log(source, newContext, oldContext);
            }
        });

        this.setState(newContext, setContextCallback);
    }

    getContext = (...getContextKeys) => {
        if (!getContextKeys) {
            return Object.seal(this.state);
        }

        return getContextKeys.reduce(
            (gettedContext, currentKey) => {
                gettedContext[currentKey] = (this.state as any)[currentKey];
                return gettedContext;
            },
            {}
        );
    }

    log = (source, newContext, oldContext) => {
        console.group('Context was changed');
        console.log('By: ', source);
        console.log('From:', oldContext);
        console.log('To:', newContext);
        console.groupEnd();
    }

    constructor(props: ProviderProps) {
        super(props);

        const { initContextValue } = props;
        const { setContextProxy, getContext } = this;

        this.state = {
            ...initContextValue,
            setContext(context: any) {
                setContextProxy(this, context);
            },
            getContext: getContext
        };
    }

    render() {
        const { Context } = ContextCreator.instance;

        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

type InjectedWrapperProps<P> = { Component: React.ComponentType<WithContextProps<any, P>> };

class InjectedWrapper<P> extends React.PureComponent<InjectedWrapperProps<P> & WithContextProps> {
    render() {
        const { Component, ...props } = this.props;

        return (
            <Component {...props as WithContextProps<any, P>} />
        );
    }
}

export function withContext<C = {}, P = {}>(...keys: Array<keyof C>) {
    return function <CP extends React.ComponentType<P & WithContextProps<C, P>>>(Component: CP) {
        const getContextToProps = (context: C & WithContextProps) => {
            const contextToProps: Partial<C & WithContextProps> = {};

            if (keys) {
                // Add context request by keys
                for (const contextKey of keys) {
                    contextToProps[contextKey] = context[contextKey];
                }
            }

            // Add required context
            contextToProps.setContext = context.setContext;
            contextToProps.getContext = context.getContext;

            return contextToProps;
        };

        return class Injector extends React.PureComponent<P> {
            render() {
                const { Context } = ContextCreator.instance;

                return (
                    <Context.Consumer>
                        {this.renderConsumer}
                    </Context.Consumer>
                );
            }

            renderConsumer = (context) => {
                const contextToProps = getContextToProps(context);

                const componentPropsWithContext = Object.assign(
                    contextToProps,
                    this.props
                ) as P & WithContextProps;

                return <InjectedWrapper Component={Component} {...componentPropsWithContext} />;
            }
        };
    };
}