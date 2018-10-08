# react-with-context
Context via props!

## Quickstart

### Setup

Wrap your app with ContextCreator, and passed `value` you want it become availiable for all child component.

```jsx
import { ContextCreator } from 'react-with-context';

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

Using withContext to get `foo` from context, and then inject it into FooComponent;

```jsx
import { withContext } from 'react-with-context';

function FooComponent(props) {
    return (
        <div>{props.foo}</div>
    )
}

// Say 'foo' if you want to inject foo to your FooComponent 
export const Foo = withContext('foo')(FooComponent);

// Or if you want both foo and bar, say 'foo' and then 'bar'
export const Foo = withContext('foo', 'bar')(FooComponent);
```

### Change context and get context (if you want to grab something directly)

When you wrapped a Component with `withContext`, two `setContext` and `getContext` will avaliabled in Component props when it render.

```jsx
function BarComponent(props) {
    const { setContext, getContext } = props;

    const { foo, bar } = getContext('foo', 'bar');

    return (
        <div>
            <div>{props.bar}</div>
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

export const Bar = withContext()(BarComponent);
```

### Decorator style

My favorite:

```jsx
@withContext('foo')
export class Foo extends React.Component {
    render() {
        // ...
    }
}
```

That all =))