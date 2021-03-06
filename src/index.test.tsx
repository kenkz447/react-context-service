import * as React from 'react';
import TestRenderer from 'react-test-renderer';

import { ContextCreator, withContext, WithContextProps, Provider, ContextRender } from './index';

interface AppContext {
    foo?: number;
    bar?: number;
}

describe('TEST', () => {
    const appContextValue: AppContext = {
        foo: 1,
        bar: 2
    };

    const appContext = React.createContext(appContextValue);

    // #Foo Component
    const renderFoo = jest.fn(() => null);

    interface FooComponentProps {
        fooPrimayProps?: string;
    }

    class FooComponent extends React.Component<WithContextProps<AppContext, FooComponentProps>> {
        render() {
            return renderFoo(this.props);
        }
    }

    const Foo = withContext<AppContext, FooComponentProps>('foo')(FooComponent);

    // #Bar Component
    interface BarComponentProps {
        barPrimayProps?: string;
    }

    const renderBar = jest.fn(() => null);
    class BarComponent extends React.Component<WithContextProps<AppContext, BarComponentProps>> {
        render() {
            return renderBar(this.props);
        }
    }

    const Bar = withContext<AppContext, BarComponentProps>('bar')(BarComponent);

    const contextRender = jest.fn(() => null);

    const AppRenderer = TestRenderer.create(
        <ContextCreator
            context={appContext}
            initContextValue={appContextValue}
        >
            <Foo />
            <Bar />
            <ContextRender<AppContext> keys={['foo']}>
                {(props) => contextRender(props)}
            </ContextRender>
        </ContextCreator>
    );

    const AppRendererInstance = AppRenderer.getInstance();
    const ProviderTestInstance = AppRenderer.root.findByType(Provider);

    const providerElement = ProviderTestInstance.instance as Provider;
    const providerDefaultProps = {
        setContext: providerElement.state.setContext as WithContextProps<AppContext>['setContext'],
        getContext: providerElement.state.getContext as WithContextProps<AppContext>['getContext']
    };

    it('should render without errors', () => {
        expect(AppRendererInstance).toBeTruthy();
    });

    it('should Foo and Bar rendered with initial context', () => {
        const initialFooProps: AppContext = {
            foo: appContextValue.foo,
            ...providerDefaultProps
        };

        expect(renderFoo).toBeCalledWith(initialFooProps);

        const initialBarProps: AppContext = {
            bar: appContextValue.bar,
            ...providerDefaultProps
        };
        expect(renderBar).toBeCalledWith(initialBarProps);
    });

    it('should get all initial context', () => {
        const initialContext = providerDefaultProps.getContext('bar', 'foo');
        expect(initialContext).toEqual(appContextValue);
    });

    it('should ContextRender rendered with init context and setContext parms', () => {
        expect(contextRender).toBeCalledWith({
            foo: appContextValue.foo,
            ...providerDefaultProps
        });
    });

    it('should "Foo" and "contextRender" re-render went foo value changed', () => {
        jest.clearAllMocks();

        providerElement.state.setContext({ foo: 2 });

        const nextFooValue = 2;

        const changedTextComponentProps: AppContext = {
            foo: nextFooValue,
            ...providerDefaultProps
        };

        expect(renderFoo).toBeCalledWith(changedTextComponentProps);
        expect(contextRender).toBeCalledWith(changedTextComponentProps);
    });

    it('should "Bar" not re-render went "num" context changed', () => {
        providerElement.state.setContext({ num: 2 });
        expect(renderBar).not.toBeCalled();
    });

    it('should get all changed context', () => {
        const initialContext = providerDefaultProps.getContext('foo');
        expect(initialContext).toEqual({
            foo: 2
        });
    });

    it('should Foo re-render went it own props changed', () => {
        jest.clearAllMocks();

        const nextFooPrimayProps = 'new-passed-props';

        AppRenderer.update(
            <ContextCreator
                context={appContext}
                initContextValue={appContextValue}
            >
                <Foo fooPrimayProps={nextFooPrimayProps} />
                <Bar />
            </ContextCreator>
        );

        const changedTextComponentProps: FooComponentProps & AppContext = {
            fooPrimayProps: nextFooPrimayProps,
            foo: 2,
            ...providerDefaultProps
        };

        expect(renderFoo).toBeCalledWith(changedTextComponentProps);
    });
});