"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var React = __importStar(require("react"));
var react_test_renderer_1 = __importDefault(require("react-test-renderer"));
var index_1 = require("./index");
describe('TEST', function () {
    var appContextValue = {
        foo: 1,
        bar: 2
    };
    var appContext = React.createContext(appContextValue);
    // #Foo Component
    var renderFoo = jest.fn(function () { return null; });
    var FooComponent = /** @class */ (function (_super) {
        __extends(FooComponent, _super);
        function FooComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FooComponent.prototype.render = function () {
            return renderFoo(this.props);
        };
        return FooComponent;
    }(React.Component));
    var Foo = index_1.withContext('foo')(FooComponent);
    var renderBar = jest.fn(function () { return null; });
    var BarComponent = /** @class */ (function (_super) {
        __extends(BarComponent, _super);
        function BarComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BarComponent.prototype.render = function () {
            return renderBar(this.props);
        };
        return BarComponent;
    }(React.Component));
    var Bar = index_1.withContext('bar')(BarComponent);
    var contextRender = jest.fn(function () { return null; });
    var AppRenderer = react_test_renderer_1.default.create(React.createElement(index_1.ContextCreator, { context: appContext, initContextValue: appContextValue },
        React.createElement(Foo, null),
        React.createElement(Bar, null),
        React.createElement(index_1.ContextRender, { keys: ['foo'] }, function (props) { return contextRender(props); })));
    var AppRendererInstance = AppRenderer.getInstance();
    var ProviderTestInstance = AppRenderer.root.findByType(index_1.Provider);
    var providerElement = ProviderTestInstance.instance;
    var providerDefaultProps = {
        setContext: providerElement.state.setContext,
        getContext: providerElement.state.getContext
    };
    it('should render without errors', function () {
        expect(AppRendererInstance).toBeTruthy();
    });
    it('should Foo and Bar rendered with initial context', function () {
        var initialFooProps = __assign({ foo: appContextValue.foo }, providerDefaultProps);
        expect(renderFoo).toBeCalledWith(initialFooProps);
        var initialBarProps = __assign({ bar: appContextValue.bar }, providerDefaultProps);
        expect(renderBar).toBeCalledWith(initialBarProps);
    });
    it('should get all initial context', function () {
        var initialContext = providerDefaultProps.getContext('bar', 'foo');
        expect(initialContext).toEqual(appContextValue);
    });
    it('should ContextRender rendered with init context and setContext parms', function () {
        expect(contextRender).toBeCalledWith(__assign({ foo: appContextValue.foo }, providerDefaultProps));
    });
    it('should "Foo" and "contextRender" re-render went foo value changed', function () {
        jest.clearAllMocks();
        providerElement.state.setContext({ foo: 2 });
        var nextFooValue = 2;
        var changedTextComponentProps = __assign({ foo: nextFooValue }, providerDefaultProps);
        expect(renderFoo).toBeCalledWith(changedTextComponentProps);
        expect(contextRender).toBeCalledWith(changedTextComponentProps);
    });
    it('should "Bar" not re-render went "num" context changed', function () {
        providerElement.state.setContext({ num: 2 });
        expect(renderBar).not.toBeCalled();
    });
    it('should get all changed context', function () {
        var initialContext = providerDefaultProps.getContext('foo');
        expect(initialContext).toEqual({
            foo: 2
        });
    });
    it('should Foo re-render went it own props changed', function () {
        jest.clearAllMocks();
        var nextFooPrimayProps = 'new-passed-props';
        AppRenderer.update(React.createElement(index_1.ContextCreator, { context: appContext, initContextValue: appContextValue },
            React.createElement(Foo, { fooPrimayProps: nextFooPrimayProps }),
            React.createElement(Bar, null)));
        var changedTextComponentProps = __assign({ fooPrimayProps: nextFooPrimayProps, foo: 2 }, providerDefaultProps);
        expect(renderFoo).toBeCalledWith(changedTextComponentProps);
    });
});
