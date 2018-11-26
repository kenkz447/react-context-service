# react-context-service

At Component level, we use `this.state` to hold dynamic data and `setState(state)` is the only path to change its. My idea is quite simple, we need an object to store global information (called context) and use `setContext` to change that object. The components do not use the entire context but just using some of the stuff they need, I created HOC `withContext('foo', 'bar')` to serve their needs.

Context object is never change but its members. Of course, changing context members will make those Components want it impacted by re-render process.

## Quickstart
This module build on new React Context API, but more neat.

### Setup
Wrap your app with ContextCreator, and passed `context` you want it become availiable for all child component.

```jsx
import { ContextCreator } from 'react-context-service';

import { Foo, Bar } from './components';

function App () {
    const appContext = {
        foo: 1,
        bar: 2
    };

    return (
        <ContextCreator value={appContext}>
            <Foo />
            <Bar />
        </ContextCreator>
    )
}
```

Using `withContext` to get `foo` from context and inject it into FooComponent via `props`;

```jsx
import { withContext } from 'react-context-service';

function FooComponent(props) {
    return (
        <div>{props.foo}</div>
    )
}

// Say 'foo' if you want to inject foo to your FooComponent:
export const Foo = withContext('foo')(FooComponent);

// Or if you want both foo and bar, say 'foo' and then 'bar':
export const Foo = withContext('foo', 'bar')(FooComponent);
```

### set and get the context

When you wrapped a Component with `withContext`, two `setContext` and `getContext` will avaliabled:

```jsx
function BarComponent(props) {
    const { bar, setContext, getContext } = props;

    const { foo, or, anything } = getContext('foo', 'or', 'anything');

    return (
        <div>
            <div>{bar}</div>
            <button 
                onClick={() => {
                    const nextBar = (bar * foo);
                    setContext({bar: nextBar})
                }}
            >
                insert bar
            </button>
        </div>
    )
}

export const Bar = withContext('bar')(BarComponent);
```
### ContextRender

```jsx
import { ContextRender } from 'react-context-service';

function contextRender() {
    return (
        <ContextRender keys={['foo']}>
            {({ foo }) => <span>{foo}</span>}
        </ContextRender>
    )
} 
```

### Decorator style

```jsx
import { withContext } from 'react-context-service';

@withContext('foo')
export class Foo extends React.Component {
    render() {
        const { foo, setContext, getContext } = this.props;
        
        return null;
    }
}
```

## Using context instance

Mixing with offical React context way:

```tsx
import { ContextCreator } from 'react-context-service';

const appContext = {
    foo: 1,
    bar: 2
};

const context = React.createContext(appContext)

function App () {
    return (
        <ContextCreator context={context} value={appContext}>
            <Child />
        </ContextCreator>
    )
}

class Child extends React.Component {
    contextType: context;
    render() {
        const { foo, bar } = this.context
        return (
            <span>{foo + bar}</span>
        )
    }
}
```

## With typescript

In case your project based on typescript, you will encounter some problems because the data type definitions.
The code below will help you avoid trouble.

```tsx
import { WithContextProps } from 'react-context-service';

/**
 * Entire app's context object,
 * everything can be store here
 */
export interface AppContext {
    foo: number;
    bar: number;
}

/**
 * Suggest two keys 'foo' and 'bar' key when
 * your typing `setContext(...keys)` or `getContext(...keys)`.
 */
export type WithAppContextProps = WithContextProps<AppContext>;
```

At Child component:

```tsx
/**
 * Props coming from parent component
 */
interface ChildComponentOwnProps {
    name: string;
}

/**
 * Completed suggestions with:
 * name, bar, setContext and getContext.
 */
type ChildComponentProps = WithContextProps<Pick<AppContext, 'bar'>, ChildComponentOwnProps>;

function ChildComponent(props: ChildComponentProps) {
    const { bar, getContext, setContext } = props;
    return <span>{bar}</span>;
}

/**
 * AppContext is help you see context key list when typing;
 * ChildComponentOwnProps is accepted props passed from parents
 */
export default withContext<ChildComponentProps, ChildComponentOwnProps>('bar')(ChildComponent)
```

and Parent:

```tsx
import ChildComponent from './ChildComponent'

<ChildComponent name="any"/>
```

That all!