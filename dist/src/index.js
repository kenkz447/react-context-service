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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var ContextCreator = /** @class */ (function (_super) {
    __extends(ContextCreator, _super);
    function ContextCreator(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, context = _a.context, initContextValue = _a.initContextValue;
        _this.Context = context || React.createContext(initContextValue);
        ContextCreator.instance = _this;
        return _this;
    }
    ContextCreator.prototype.render = function () {
        var _this = this;
        var _a = this.props, loggingEnabled = _a.loggingEnabled, children = _a.children, initContextValue = _a.initContextValue;
        return (React.createElement(Provider, { ref: function (e) { return _this.provider = e; }, initContextValue: initContextValue, loggingEnabled: loggingEnabled }, children));
    };
    return ContextCreator;
}(React.Component));
exports.ContextCreator = ContextCreator;
var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider(props) {
        var _this = _super.call(this, props) || this;
        _this.setContextProxy = function (source, newContext) {
            var loggingEnabled = _this.props.loggingEnabled;
            var newContextKey = Object.keys(newContext);
            var oldContext = _this.getContext(newContextKey);
            var setContextCallback = (function () {
                if (loggingEnabled) {
                    _this.log(source, newContext, oldContext);
                }
            });
            _this.setState(newContext, setContextCallback);
        };
        _this.getContext = function () {
            var contextKeys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                contextKeys[_i] = arguments[_i];
            }
            if (!contextKeys || !contextKeys.length) {
                return Object.seal(_this.state);
            }
            return contextKeys.reduce(function (gettedContext, currentKey) {
                gettedContext[currentKey] = _this.state[currentKey];
                return gettedContext;
            }, {});
        };
        _this.log = function (source, newContext, oldContext) {
            console.group('Context was changed');
            console.log('By: ', source);
            console.log('From:', oldContext);
            console.log('To:', newContext);
            console.groupEnd();
        };
        var initContextValue = props.initContextValue;
        var _a = _this, setContextProxy = _a.setContextProxy, getContext = _a.getContext;
        _this.state = __assign({}, initContextValue, { setContext: function (context) {
                setContextProxy(this, context);
            }, getContext: getContext });
        return _this;
    }
    Provider.prototype.render = function () {
        var Context = ContextCreator.instance.Context;
        return (React.createElement(Context.Provider, { value: this.state }, this.props.children));
    };
    return Provider;
}(React.Component));
exports.Provider = Provider;
var InjectedWrapper = /** @class */ (function (_super) {
    __extends(InjectedWrapper, _super);
    function InjectedWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InjectedWrapper.prototype.render = function () {
        var _a = this.props, Component = _a.Component, props = __rest(_a, ["Component"]);
        return (React.createElement(Component, __assign({}, props)));
    };
    return InjectedWrapper;
}(React.PureComponent));
function withContext() {
    var keys = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        keys[_i] = arguments[_i];
    }
    return function (Component) {
        var getContextToProps = function (context) {
            var e_1, _a;
            var contextToProps = {};
            if (keys) {
                try {
                    // Add context request by keys
                    for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                        var contextKey = keys_1_1.value;
                        contextToProps[contextKey] = context[contextKey];
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            // Add required context
            contextToProps.setContext = context.setContext;
            contextToProps.getContext = context.getContext;
            return contextToProps;
        };
        return /** @class */ (function (_super) {
            __extends(Injector, _super);
            function Injector() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.renderConsumer = function (context) {
                    var contextToProps = getContextToProps(context);
                    var componentPropsWithContext = Object.assign(contextToProps, _this.props);
                    return React.createElement(InjectedWrapper, __assign({ Component: Component }, componentPropsWithContext));
                };
                return _this;
            }
            Injector.prototype.render = function () {
                var Context = ContextCreator.instance.Context;
                return (React.createElement(Context.Consumer, null, this.renderConsumer));
            };
            return Injector;
        }(React.PureComponent));
    };
}
exports.withContext = withContext;
var ContextRender = /** @class */ (function (_super) {
    __extends(ContextRender, _super);
    function ContextRender() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderConsumer = function (context) {
            var _a = _this.props, children = _a.children, keys = _a.keys;
            var contextToProps = keys.reduce(function (childContext, childContextKey) {
                var _a;
                return __assign({}, childContext, (_a = {}, _a[childContextKey] = context[childContextKey], _a));
            }, {
                setContext: context.setContext,
                getContext: context.getContext
            });
            return children(contextToProps);
        };
        return _this;
    }
    ContextRender.prototype.render = function () {
        var Context = ContextCreator.instance.Context;
        return (React.createElement(Context.Consumer, null, this.renderConsumer));
    };
    return ContextRender;
}(React.PureComponent));
exports.ContextRender = ContextRender;
