![alt tag](./assets/battlecouch_logo.png)
> https://battlecouch.io is an online indie games platform that create and distribute social and party games. This library serves as a bridge between a BattleCouch Webview and an Unity game.

[![npm](https://img.shields.io/npm/v/battlecouchjs.svg)](https://npmjs.org/package/battlecouchjs)

To use this, you will need to setup a BattleCouch developer account at
https://developer.battlecouch.io

## Install

```bash
npm install battlecouchjs --save
```

----

## Usage

Import it the way you want into your project :

```javascript
// CommonJS
var BattleCouch = require('battlecouchjs');
BattleCouch.Init(options);
```

```javascript
// AMD
define(['battlecouchjs'], function (BattleCouch) {
    BattleCouch.Init(options);
});
```

```javascript
// Module
import BattleCouch from 'battlecouchjs';
```

```html
<!-- Global -->
<script src="./battlecouchjs.js"></script>
<script>
    BattleCouch.Init(options);
</script>
```

## Options
You can configure your webview in different ways (settings are optional):

```javascript
var options = {
  useSandboxLogger: Boolean,      // Default: true | Will redirect 'console.log()', 'console.warn()' and 'console.error()' messages to the sandbox dev console
  
  // Note: Enable the "use sensor" option in your unity project to use this
  sensorRequired: Boolean,        // Default: false | Will prevent the player from playing the game if the orientation & motion sensors are not supported or not available.
  sensorEventEnabled: Boolean,    // Default: true | Enable or Disable the sensor data event on start. This can be turned On or Off later.
  sensorEventSendRate: Number,    // Default: 10 | min=1 max=10 | How many times per second the sensor data will be sent.
};
```
