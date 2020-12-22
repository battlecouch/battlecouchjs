# battlecouchJS


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
  sensorRequired: Boolean,        // Default: false | Will prevent the player from playing the game if the orientation & motion sensors are not supported or not available.
  sensorEventEnabled: Boolean,    // Default: true | Enable or Disable the sensor data event on start. This can be turned On or Off later.
};
```
