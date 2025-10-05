/*
 _     __     _ __
| |  / /___ _(_) /____
| | /| / / __ `/ / / ___/
| |/ |/ / /_/ / / (__  )
|__/|__/\__,_/_/_/____/
The electron alternative for Go
(c) Lea Anthony 2019-present
*/
import { nanoid } from './nanoid.js';

// NOTE: Changed url to demonstarte on external website
const runtimeURL = 'wails://localhost' + "/wails/runtime";
// Object Names
export const objectNames = Object.freeze({
    Call: 0,
    Clipboard: 1,
    Application: 2,
    Events: 3,
    ContextMenu: 4,
    Dialog: 5,
    Window: 6,
    Screens: 7,
    System: 8,
    Browser: 9,
    CancelCall: 10,
});
export let clientId = nanoid();
/**
 * Creates a new runtime caller with specified ID.
 *
 * @param object - The object to invoke the method on.
 * @param windowName - The name of the window.
 * @return The new runtime caller function.
 */
export function newRuntimeCaller(object, windowName = '') {
    return function (method, args = null) {
        return runtimeCallWithID(object, method, windowName, args);
    };
}
async function runtimeCallWithID(objectID, method, windowName, args) {
    var _a, _b;
    let url = new URL(runtimeURL);
    url.searchParams.append("object", objectID.toString());
    url.searchParams.append("method", method.toString());
    if (args) {
        url.searchParams.append("args", JSON.stringify(args));
    }
    let headers = {
        ["x-wails-client-id"]: clientId
    };
    if (windowName) {
        headers["x-wails-window-name"] = windowName;
    }
    let response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(await response.text());
    }
    if (((_b = (_a = response.headers.get("Content-Type")) === null || _a === void 0 ? void 0 : _a.indexOf("application/json")) !== null && _b !== void 0 ? _b : -1) !== -1) {
        return response.json();
    }
    else {
        return response.text();
    }
}

// NOTE: methods for bindings via post message
export function newRuntimeCallerPostMessage(object, windowName = '') {
    return function (method, args = null) {
        return runtimeCallWithIDPostMessage(object, method, windowName, args);
    };
}

async function runtimeCallWithIDPostMessage(objectID, method, windowName, args) {
  let url = new URL(runtimeURL);
  url.searchParams.append("object", objectID.toString());
  url.searchParams.append("method", method.toString());
  if (args) {
    url.searchParams.append("args", JSON.stringify(args));
  }
  let headers = {
    ["x-wails-client-id"]: clientId
  };
  if (windowName) {
    headers["x-wails-window-name"] = windowName;
  }
  await _invoke(JSON.stringify({url, headers}));
}

const _invoke = (function () {
    var _a, _b, _c, _d, _e;
    try {
        if ((_b = (_a = window.chrome) === null || _a === void 0 ? void 0 : _a.webview) === null || _b === void 0 ? void 0 : _b.postMessage) {
            return window.chrome.webview.postMessage.bind(window.chrome.webview);
        }
        else if ((_e = (_d = (_c = window.webkit) === null || _c === void 0 ? void 0 : _c.messageHandlers) === null || _d === void 0 ? void 0 : _d['external']) === null || _e === void 0 ? void 0 : _e.postMessage) {
            return window.webkit.messageHandlers['external'].postMessage.bind(window.webkit.messageHandlers['external']);
        }
    }
    catch (e) { }
    console.warn('\n%c⚠️ Browser Environment Detected %c\n\n%cOnly UI previews are available in the browser. For full functionality, please run the application in desktop mode.\nMore information at: https://v3.wails.io/learn/build/#using-a-browser-for-development\n', 'background: #ffffff; color: #000000; font-weight: bold; padding: 4px 8px; border-radius: 4px; border: 2px solid #000000;', 'background: transparent;', 'color: #ffffff; font-style: italic; font-weight: bold;');
    return null;
})();
