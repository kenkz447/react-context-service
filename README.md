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

### Decorator style

My favorite:

```jsx
@withContext('foo')
export class Foo extends React.Component {
    render() {
        const { foo, setContext, getContext } = this.props;
        
        return null;
    }
}
```

That all =))