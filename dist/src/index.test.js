"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
const index_1 = require("./index");
describe('TEST', () => {
    const appContextValue = {
        foo: 1,
        bar: 2
    };
    const appContext = React.createContext(appContextValue);
    // #Foo Component
    const renderFoo = jest.fn(() => null);
    class FooComponent extends React.Component {
        render() {
            return renderFoo(this.props);
        }
    }
    const Foo = index_1.withContext('foo')(FooComponent);
    const renderBar = jest.fn(() => null);
    class BarComponent extends React.Component {
        render() {
            return renderBar(this.props);
        }
    }
    const Bar = index_1.withContext('bar')(BarComponent);
    const contextRender = jest.fn(() => null);
    const AppRenderer = react_test_renderer_1.default.create(React.createElement(index_1.ContextCreator, { context: appContext, initContextValue: appContextValue },
        React.createElement(Foo, null),
        React.createElement(Bar, null),
        React.createElement(index_1.ContextRender, { keys: ['foo'] }, (props) => contextRender(props))));
    const AppRendererInstance = AppRenderer.getInstance();
    const ProviderTestInstance = AppRenderer.root.findByType(index_1.Provider);
    const providerElement = ProviderTestInstance.instance;
    const providerDefaultProps = {
        setContext: providerElement.state.setContext,
        getContext: providerElement.state.getContext
    };
    it('should render without errors', () => {
        expect(AppRendererInstance).toBeTruthy();
    });
    it('should Foo and Bar rendered with initial context', () => {
        const initialFooProps = Object.assign({ foo: appContextValue.foo }, providerDefaultProps);
        expect(renderFoo).toBeCalledWith(initialFooProps);
        const initialBarProps = Object.assign({ bar: appContextValue.bar }, providerDefaultProps);
        expect(renderBar).toBeCalledWith(initialBarProps);
    });
    it('should get all initial context', () => {
        const initialContext = providerDefaultProps.getContext('bar', 'foo');
        expect(initialContext).toEqual(appContextValue);
    });
    it('should ContextRender rendered with init context and setContext parms', () => {
        expect(contextRender).toBeCalledWith(Object.assign({ foo: appContextValue.foo }, providerDefaultProps));
    });
    it('should "Foo" and "contextRender" re-render went foo value changed', () => {
        jest.clearAllMocks();
        providerElement.state.setContext({ foo: 2 });
        const nextFooValue = 2;
        const changedTextComponentProps = Object.assign({ foo: nextFooValue }, providerDefaultProps);
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
        AppRenderer.update(React.createElement(index_1.ContextCreator, { context: appContext, initContextValue: appContextValue },
            React.createElement(Foo, { fooPrimayProps: nextFooPrimayProps }),
            React.createElement(Bar, null)));
        const changedTextComponentProps = Object.assign({ fooPrimayProps: nextFooPrimayProps, foo: 2 }, providerDefaultProps);
        expect(renderFoo).toBeCalledWith(changedTextComponentProps);
    });
});
