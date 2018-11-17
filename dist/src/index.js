"use strict";
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
        this.Context = React.createContext({});
        ContextCreator.instance = this;
    }
    render() {
        const { value, loggingEnabled, children } = this.props;
        return (React.createElement(Provider, { ref: (e) => this.provider = e, value: value, loggingEnabled: loggingEnabled }, children));
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
        this.getContext = (...getContextKeys) => {
            if (!getContextKeys) {
                return Object.seal(this.state);
            }
            return getContextKeys.reduce((gettedContext, currentKey) => {
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
        const { value } = props;
        const { setContextProxy, getContext } = this;
        this.state = Object.assign({}, value, { setContext(context) {
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
    constructor() {
        super(...arguments);
        /**
         * Exclude Component from Wrapper's props.
         */
        this.getComponentProps = () => {
            const props = {};
            for (const key in this.props) {
                if (!this.props.hasOwnProperty(key) || key === 'Component') {
                    continue;
                }
                const element = this.props[key];
                props[key] = element;
            }
            return props;
        };
    }
    render() {
        const { Component } = this.props;
        return (React.createElement(Component, Object.assign({}, this.getComponentProps())));
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
