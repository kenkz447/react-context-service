import * as React from 'react';
import TestRenderer from 'react-test-renderer';

import { ContextCreator, withContext, ContextProps, Provider } from './index';

interface AppContext {
    foo?: number;
    bar?: number;
}

describe('TEST', () => {
    const appContext: AppContext = {
        foo: 1,
        bar: 2
    };

    // #Foo Component
    const renderFoo = jest.fn(() => null);

    interface FooComponentProps extends ContextProps, Pick<AppContext, 'foo'> {
        fooPrimayProps?: string;
    }

    class FooComponent extends React.Component<FooComponentProps> {
        render() {
            return renderFoo(this.props);
        }
    }

    const Foo = withContext<FooComponentProps>('foo')(FooComponent);

    // #Bar Component
    interface BarComponentProps extends ContextProps, Pick<AppContext, 'bar'> {
        barPrimayProps?: string;
    }
    const renderBar = jest.fn(() => null);
    class BarComponent extends React.Component<BarComponentProps> {
        render() {
            return renderBar(this.props);
        }
    }
    const Bar = withContext<BarComponentProps>('bar')(BarComponent);

    const AppRenderer = TestRenderer.create(
        <ContextCreator value={appContext}>
            <Foo />
            <Bar />
        </ContextCreator>
    );

    const AppRendererInstance = AppRenderer.getInstance();
    const ProviderTestInstance = AppRenderer.root.findByType(Provider);

    const providerElement = ProviderTestInstance.instance as Provider;
    const providerDefaultProps = {
        setContext: providerElement.state.setContext,
        getContext: providerElement.state.getContext
    };

    describe('initial render', () => {

        it('should render without errors', () => {
            expect(AppRendererInstance).toBeTruthy();
        });

        it('should Foo and Bar rendered with initial context', () => {
            const initialFooProps: AppContext = {
                foo: appContext.foo,
                ...providerDefaultProps
            };

            expect(renderFoo).toBeCalledWith(initialFooProps);

            const initialBarProps: AppContext = {
                bar: appContext.bar,
                ...providerDefaultProps
            };
            expect(renderBar).toBeCalledWith(initialBarProps);
        });

        it('should get all initial context', () => {
            const initialContext = providerDefaultProps.getContext<AppContext>('bar', 'foo');
            expect(initialContext).toEqual(appContext);
        });
    });

    describe('re-render', () => {
        it('should Foo re-render went foo value changed', () => {
            jest.clearAllMocks();

            providerElement.state.setContext({ foo: 2 });

            const changedTextComponentProps: AppContext = {
                foo: 2,
                ...providerDefaultProps
            };

            expect(renderFoo).toBeCalledWith(changedTextComponentProps);
        });

        it('should Bar not re-render went foo context changed', () => {
            providerElement.state.setContext({ num: 2 });

            expect(renderBar).not.toBeCalled();
        });

        it('should get all changed context', () => {
            const initialContext = providerDefaultProps.getContext<AppContext>( 'foo');
            expect(initialContext).toEqual({
                foo: 2
            });
        });

        it('should Foo re-render went props changed', () => {
            jest.clearAllMocks();

            AppRenderer.update(
                <ContextCreator value={appContext}>
                    <Foo fooPrimayProps="new-passed-props" />
                    <Bar />
                </ContextCreator>
            );

            const changedTextComponentProps: FooComponentProps = {
                fooPrimayProps: 'new-passed-props',
                foo: 2,
                ...providerDefaultProps
            };

            expect(renderFoo).toBeCalledWith(changedTextComponentProps);
        });
    });
});