import * as React from 'react';

type ContextProviderProps<P = {}> = {
    value: P;
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

    Context: React.Context<ContextProviderProps['value']>;
    provider!: Provider;

    constructor(props: ContextProviderProps) {
        super(props);

        this.Context = React.createContext({});
        ContextCreator.instance = this;
    }

    render() {
        const { value, loggingEnabled, children } = this.props;
        return (
            <Provider
                ref={(e: Provider) => this.provider = e}
                value={value}
                loggingEnabled={loggingEnabled}
            >
                {children}
            </Provider>
        );
    }
}

interface ProviderProps {
    loggingEnabled?: boolean;
    value: any;
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
            {} as any
        );
    }

    log = (source, newContext, oldContext) => {
        console.group('Context was changed');
        console.log('By: ', source);
        console.log('From:', oldContext);
        console.log('To:', newContext);
        console.groupEnd();
    }

    constructor(props: any) {
        super(props);

        const { value } = props;
        const { setContextProxy, getContext } = this;

        this.state = {
            ...value,
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

type InjectedWrapperComponentProps<P> = P & WithContextProps;
type InjectedWrapperProps<P> = { Component: React.ComponentType<InjectedWrapperComponentProps<P>> };

class InjectedWrapper<P> extends React.PureComponent<InjectedWrapperProps<P> & WithContextProps> {
    render() {
        const { Component } = this.props;

        return (
            <Component {...this.getComponentProps()} />
        );
    }

    /**
     * Exclude Component from Wrapper's props.
     */
    getComponentProps = () => {
        const props = {} as InjectedWrapperComponentProps<P>;
        for (const key in this.props) {
            if (!this.props.hasOwnProperty(key) || key === 'Component') {
                continue;
            }

            const element = this.props[key];
            props[key] = element;
        }

        return props;
    }
}

export function withContext<C = {}, P = {}>(...keys: Array<keyof C>) {
    return function <CP extends React.ComponentType<P & WithContextProps>>(Component: CP) {
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