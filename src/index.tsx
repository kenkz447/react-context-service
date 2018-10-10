import * as React from 'react';

type ContextProviderProps<P = {}> = { value: P; };
type ReactContructor<P = {}> = new (props: P) => React.Component<P>;

type ProviderState = Required<WithContextProps>;

type SetContext<T> = (context: Partial<T>) => void;
type GetContext<P> = (...key: Array<keyof P>) => Pick<P, keyof P>;

export interface WithContextProps<T = {}> {
    setContext: SetContext<T>;
    getContext: GetContext<T>;
}

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
        const { value, children } = this.props;
        return (
            <Provider
                ref={(e: Provider) => this.provider = e}
                value={value}
            >
                {children}
            </Provider>
        );
    }
}

interface ProviderProps {
    value: any;
}

export class Provider extends React.Component<ProviderProps, ProviderState> {
    constructor(props: any) {
        super(props);

        const { value } = props;

        this.state = {
            ...value,
            setContext: (context: any) => {
                this.setState(context);
            },
            getContext: (...getContextKeys) => {
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

export function withContext<C = {}, P = {}>(...keys: Array<keyof C>) {
    return (Component: ReactContructor<P>) => {

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

        class InjectedWrapper extends React.PureComponent<P> {
            render() {
                return (
                    <Component {...this.props} />
                );
            }
        }

        return class Injector extends React.PureComponent<P> {
            consumberRef = React.createRef<React.Component<P>>();

            constructor(props: P) {
                super(props);
            }

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
                );

                return <InjectedWrapper {...componentPropsWithContext} />;
            }
        };
    };
}