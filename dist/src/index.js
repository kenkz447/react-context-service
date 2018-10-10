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
        const { value, children } = this.props;
        return (React.createElement(Provider, { ref: (e) => this.provider = e, value: value }, children));
    }
}
exports.ContextCreator = ContextCreator;
class Provider extends React.Component {
    constructor(props) {
        super(props);
        const { value } = props;
        this.state = Object.assign({}, value, { setContext: (context) => {
                this.setState(context);
            }, getContext: (...getContextKeys) => {
                if (!getContextKeys) {
                    return Object.seal(this.state);
                }
                return getContextKeys.reduce((gettedContext, currentKey) => {
                    gettedContext[currentKey] = this.state[currentKey];
                    return gettedContext;
                }, {});
            } });
    }
    render() {
        const { Context } = ContextCreator.instance;
        return (React.createElement(Context.Provider, { value: this.state }, this.props.children));
    }
}
exports.Provider = Provider;
function withContext(...keys) {
    return (Component) => {
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
        class InjectedWrapper extends React.PureComponent {
            render() {
                return (React.createElement(Component, Object.assign({}, this.props)));
            }
        }
        return class Injector extends React.PureComponent {
            constructor() {
                super(...arguments);
                this.renderConsumer = (context) => {
                    const contextToProps = getContextToProps(context);
                    const componentPropsWithContext = Object.assign(contextToProps, this.props);
                    return React.createElement(InjectedWrapper, Object.assign({}, componentPropsWithContext));
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
