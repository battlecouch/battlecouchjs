/**
 *  ----------------------------------------------------------------------------------------------
 *  Private Functions
 *  ----------------------------------------------------------------------------------------------
 */

let BattleCouch = {};
let WebViewListeners = {};
let IsInitialized = false;
    
function EmitToWebView(event, data) 
{
    if (Array.isArray(WebViewListeners[event]))
        WebViewListeners[event].forEach(listener => listener(data));
}

function SendMsgToParentView(eventType, data) // async
{
    let newMsg =
    {
        eventType: eventType,
        data: data
    };
    window.parent.postMessage(newMsg, '*');
}

function OnReceiveMsg(e)
{
    let eventType = e.data.eventType;
    let data = e.data.data;
    EmitToWebView(eventType, data);
}

function OnViewReady()
{
    SendMsgToParentView('OnViewReady');
}

function SetWebviewSettings(opts)
{
    // Hijack the default console fow the sandbox one
    if (opts.useSandboxLogger === true)
    {
        console.log = function (message) { BattleCouch.LogSandboxMsg(0, message); };
        console.warn = function (message) { BattleCouch.LogSandboxMsg(1, message); };
        console.error = function (message) { BattleCouch.LogSandboxMsg(2, message); };
    }

    // Will handle change in parent (ex: EnableSensorDataEvent(), etc.)
    SendMsgToParentView('SetWebViewSettings', opts);
}



/**
 *  ----------------------------------------------------------------------------------------------
 *  Public Functions
 *  ----------------------------------------------------------------------------------------------
 */


/**
 * Should be called when your webview is ready otherwise you won't be receiving any message.
 * React -> Call this in 'componentDidMount()'.
 *
 * @param {object} opts
 */
BattleCouch.Init = function (opts)
{
    if (IsInitialized === true) return;

    // Settings
    let webviewOpts = {};
    webviewOpts.useSandboxLogger = GetBool(opts.useSandboxLogger, false); // Log in the BC sandbox console
    webviewOpts.sensorRequired = GetBool(opts.sensorRequired, false); // Disable the webview if sensor are not supported
    webviewOpts.sensorEventEnabled = GetBool(opts.sensorEventEnabled, false); // Send the sensor data or not
    webviewOpts.sensorEventSendRate = parseInt(opts.sensorEventSendRate, 10); // How many times per second the sensor data will be sent


    // Listeners
    WebViewListeners = {};
    window.addEventListener('message', OnReceiveMsg, false);


    // Events    
    SetWebviewSettings(webviewOpts);
    CheckBrowserSupport(); // Add simulator click support
    OnViewReady();

    IsInitialized = true;
};

/**
 * Remove the BattleCouch webview listeners. Should be called when the page is unloading.
 * React -> Call this in 'componentWillUnmount()'.
 *
 */
BattleCouch.Destroy = function()
{
    if (IsInitialized === false)
        return;

    WebViewListeners = {};
    window.removeEventListener('message', OnReceiveMsg);

    IsInitialized = false;
};

/**
 * Listen to BattleCouch events. <br>
 * "OnUserProfileSettingsChange" = username, usercolor, deviceId, isPremium (Party Features)<br>
 * "OnWebViewUpdate" = webview data received from the game (your custom view id / data)<br>
 * "OnGameDataToDevice" = data received from the game<br>
 * "OnDeviceSensorData" = device motion & orientation data<br>
 *
 * @param {string} event
 * @param {callback} callback
 */
BattleCouch.On = function(event, callback)
{
    // Discard invalid listeners 
    if ('function' !== typeof callback)
        return;

    // setup a new event if necessary 
    if ('undefined' === typeof WebViewListeners[event])
    {
        WebViewListeners[event] = new Array;
    }

    // register the listener to the event 
    WebViewListeners[event].push(callback);
};

/**
 * Send an event to the game.
 *
 * @param {string} evtName
 */
BattleCouch.SendEvent = function(evtName)
{
    SendMsgToParentView('OnSendEvent', evtName);
};

/**
 * Send data to the game.
 *
 * @param {object} jsonData
 */
BattleCouch.SendData = function(jsonData)
{
    SendMsgToParentView('OnSendData', jsonData);
};

/**
 * This will set the Alpha rotation to 0 on the browser side. 
 * The sensor data will return the relative value based on this angle.<br>
 * 
 * You can also set the default angles for a specific axis ex: ['alpha', 'beta', 'gamma'].<br>
 * @param {Array} axis
 */
BattleCouch.SetDeviceOrientation = function(axis= undefined)
{
    SendMsgToParentView('SetDeviceOrientation', axis);
};

/**
 * SANDBOX ONLY: Will log the message to the dev console. <br>
 * Type: 0=normal, 1=warning, 2=error<br>
 * Message: object or string
 * 
 * @param {Number} type
 * @param {object} message
 */
BattleCouch.LogSandboxMsg = function(type, msg)
{
    SendMsgToParentView('LogSandboxMsg', { type: type, msg: msg });
};

/**
 * Will turn On or Off the sensor data event for the current device. <br>
 * This can be useful if you offer different controller type (ex: Tilt or Joystick)
 */
BattleCouch.EnableSensorDataEvent = function(value)
{
    SendMsgToParentView('EnableSensorDataEvent', GetBool(value, true));
};

/**
 *  ----------------------------------------------------------------------------------------------
 *  Development Functions
 *  ----------------------------------------------------------------------------------------------
 */

/**
 * Detect if a simulator is currently running the webview.
 */
BattleCouch.IsSimulator = function()
{
    let urlParams = new URLSearchParams(window.location.search);
    let param = urlParams.get('useSimulator');
    if(param != undefined)
        return param.toLowerCase() == 'true' ? true : false;
    return false;
};

/**
 * Detect if we need to convert touch input to mouse click.
 */
function UseMouseClick()
{
    let urlParams = new URLSearchParams(window.location.search);
    let param = urlParams.get('useMouseClick');
    if(param != undefined)
        return param.toLowerCase() == 'true' ? true : false;
    return false;
}

/**
 * Called in BattleCouch.Init() to enable mouse click support on simulator.
 */
function CheckBrowserSupport()
{
    if(BattleCouch.IsSimulator() || UseMouseClick())
    {
        // Note : Not working on React components
        if (!('ontouchstart' in document.createElement('div')))
        {
            let elements = document.getElementsByTagName('*');
            for (let i = 0; i < elements.length; ++i)
            {
                let element = elements[i];
                let onTouchStartAttribute = element.getAttribute('ontouchstart');
                let onTouchEndAttribute = element.getAttribute('ontouchend');
                if (onTouchStartAttribute)
                    element.setAttribute('onmousedown', onTouchStartAttribute);
                if (onTouchEndAttribute)
                    element.setAttribute('onmouseup', onTouchEndAttribute);
            }
        }
    }
}


/**
 *  ----------------------------------------------------------------------------------------------
 *  Utils Functions
 *  ----------------------------------------------------------------------------------------------
 */

function GetBool(value, defaultValue)
{
    if (typeof (value) === undefined)
        return defaultValue;
 
    else if (typeof (value) === 'string')
        value = value.trim().toLowerCase();
    
    switch (value)
    {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
        return true;
    default:
        return false;
    }    
}

export default BattleCouch;