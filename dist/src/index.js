"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class ContextCreator extends React.Component {
    constructor(props) {
        super(props);
        const { context, initContextValue } = this.props;
        this.Context = context || React.createContext(initContextValue);
        ContextCreator.instance = this;
    }
    render() {
        const { loggingEnabled, children, initContextValue } = this.props;
        return (React.createElement(Provider, { ref: (e) => this.provider = e, initContextValue: initContextValue, loggingEnabled: loggingEnabled }, children));
    }
}
exports.ContextCreator = ContextCreator;
class Provider extends React.Component {
    constructor(props) {
        super(props);
        this.setContextProxy = (source, newContext) => {
            const { loggingEnabled } = this.props;
            const newContextKey = Object.keys(newContext);
            const oldContext = this.getContext(newContextKey);
            const setContextCallback = (() => {
                if (loggingEnabled) {
                    this.log(source, newContext, oldContext);
                }
            });
            this.setState(newContext, setContextCallback);
        };
        this.getContext = (...contextKeys) => {
            if (!contextKeys || !contextKeys.length) {
                return Object.seal(this.state);
            }
            return contextKeys.reduce((gettedContext, currentKey) => {
                gettedContext[currentKey] = this.state[currentKey];
                return gettedContext;
            }, {});
        };
        this.log = (source, newContext, oldContext) => {
            console.group('Context was changed');
            console.log('By: ', source);
            console.log('From:', oldContext);
            console.log('To:', newContext);
            console.groupEnd();
        };
        const { initContextValue } = props;
        const { setContextProxy, getContext } = this;
        this.state = Object.assign({}, initContextValue, { setContext(context) {
                setContextProxy(this, context);
            }, getContext: getContext });
    }
    render() {
        const { Context } = ContextCreator.instance;
        return (React.createElement(Context.Provider, { value: this.state }, this.props.children));
    }
}
exports.Provider = Provider;
class InjectedWrapper extends React.PureComponent {
    render() {
        const _a = this.props, { Component } = _a, props = __rest(_a, ["Component"]);
        return (React.createElement(Component, Object.assign({}, props)));
    }
}
function withContext(...keys) {
    return function (Component) {
        const getContextToProps = (context) => {
            const contextToProps = {};
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
        return class Injector extends React.PureComponent {
            constructor() {
                super(...arguments);
                this.renderConsumer = (context) => {
                    const contextToProps = getContextToProps(context);
                    const componentPropsWithContext = Object.assign(contextToProps, this.props);
                    return React.createElement(InjectedWrapper, Object.assign({ Component: Component }, componentPropsWithContext));
                };
            }
            render() {
                const { Context } = ContextCreator.instance;
                return (React.createElement(Context.Consumer, null, this.renderConsumer));
            }
        };
    };
}
exports.withContext = withContext;
class ContextRender extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.renderConsumer = (context) => {
            const { children, keys } = this.props;
            const contextToProps = keys.reduce((childContext, childContextKey) => {
                return Object.assign({}, childContext, { [childContextKey]: context[childContextKey] });
            }, {
                setContext: context.setContext,
                getContext: context.getContext
            });
            return children(contextToProps);
        };
    }
    render() {
        const { Context } = ContextCreator.instance;
        return (React.createElement(Context.Consumer, null, this.renderConsumer));
    }
}
exports.ContextRender = ContextRender;
