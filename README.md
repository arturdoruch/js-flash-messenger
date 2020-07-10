# Flash messenger

Displays flash messages on the screen.

## Install

```
yarn add @arturdoruch/flash-messenger
```

## Usage

```js
import FlashMessenger from '@arturdoruch/flash-messenger';

const flashMessenger = new FlashMessenger({
    // Options. See options description below.
});

// Adds messages with custom types to the stack. 
flashMessenger.add('error', 'An error occurred.');
flashMessenger.add('notice', 'Notice message.');
flashMessenger.add('success', 'Success message.');

// Displays messages of all types.
flashMessenger.display();

// Displays messages of specific type.
flashMessenger.display('error');
```

### Global options

Global options applied to the all FlashMessenger instances.
Set by calling function setOptions().

```js
import { setOptions as flashMessengerSetOptions } from '@arturdoruch/flash-messenger';

flashMessengerSetOptions({
    // Options 
});
```

 * `elementsClassPrefix` string (default: `flash-message`)
 
    The class name prefix of the message container and item elements.

 * all the [common options](#common-options)
    

### Instance options  

Options specific for FlashMessenger instance.

```js
import FlashMessenger from '@arturdoruch/flash-messenger';

const flashMessenger = new FlashMessenger({
    // Options
});
```

 * `containerClassName` string (default: `null`)
 
    Adds custom class name for message container div element.
    
 * all the [common options](#common-options)


### Common options

Global and per instance FlashMessenger options.
 
 * `removeAfter` int|null (default: `5`)
 
    Time (in seconds) after message item will be removed form the container.
    If null message item will not be removed until will be clicked.

 * `removeOnClick` boolean (default: `true`)
 
    Specifies whether the message item should be removed after clicking.

 * `positionVertical` string (default: `top`)
 
    Vertical position of displayed message container. One of: `top`, `center`, `bottom`.
 
 * `positionHorizontal` string (default: `center`)
 
    Horizontal position of displayed message container. One of: `left`, `center`, `right`.


### CSS styles

For styling flash messages use existing CSS styles `import '@arturdoruch/flash-messenger/styles/flash-messenger.css';`
or create your own.

