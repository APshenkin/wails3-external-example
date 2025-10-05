# External Example

This repository demonstates ability to use wails binding with external websites using postMessages and that it's not possible using http fetch option.

How to launch:
1. Use `make setup-local-ssl` to setup local ssl certificates to simulate app that is deployed somewhere elsewhere on https://app-local.wails-awesome.io:3000/ (note this step is implemented for macOS. If you use Windows you need to generate self signed certificates by your own).
2. Build the application using `wails3 build`.
3. Run vite dev server with `cd frontend && npm run dev`
4. This will launch the app under https://app-local.wails-awesome.io:3000/
5. Open the app and dev console for it.
6. Try to use Greet with http bindings and postMessage bindings.

Note: @wailsio/runtime is forked to demonstrate this. Search for // NOTE: comments to see where additions were made.
