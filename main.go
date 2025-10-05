package main

import (
	"embed"
	_ "embed"
	"encoding/json"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"strconv"

	"github.com/wailsapp/wails/v3/pkg/application"
)

// Wails uses Go's `embed` package to embed the frontend files into the binary.
// Any files in the frontend/dist folder will be embedded into the binary and
// made available to the frontend.
// See https://pkg.go.dev/embed for more information.

//go:embed all:frontend/dist
var assets embed.FS

type rawMessageHandlerMessage struct {
	URL     string
	Headers map[string]string
}

type DummyResponseWriter struct {
}

func (DummyResponseWriter) Header() http.Header       { return make(http.Header) }
func (DummyResponseWriter) Write([]byte) (int, error) { return 0, nil }
func (DummyResponseWriter) WriteHeader(int)           {}

// main function serves as the application's entry point. It initializes the application, creates a window,
// and starts a goroutine that emits a time-based event every second. It subsequently runs the application and
// logs any error that might occur.
func main() {

	messageProcessor := application.NewMessageProcessor(slog.Default())
	dummyResponseWriter := &DummyResponseWriter{}

	// Create a new Wails application by providing the necessary options.
	// Variables 'Name' and 'Description' are for application metadata.
	// 'Assets' configures the asset server with the 'FS' variable pointing to the frontend files.
	// 'Bind' is a list of Go struct instances. The frontend has access to the methods of these instances.
	// 'Mac' options tailor the application when running an macOS.
	app := application.New(application.Options{
		Name:        "external-example",
		Description: "A demo of using raw HTML & CSS",
		Services: []application.Service{
			application.NewService(&GreetService{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		//Bindings: application.BindingConfig{
		//	// Longer timeout for production workloads
		//	Timeout: 10 * time.Minute,
		//
		//	// Strict CORS configuration for production
		//	CORS: application.CORSConfig{
		//		// Enable CORS with strict controls
		//		Enabled: true,
		//
		//		// Only allow specific production origins
		//		AllowedOrigins: []string{
		//			"https://app-local.wails-awesome.io:3000",
		//			"https://app-local.wails-awesome.io",
		//			//"https://app.myapp.com",
		//			//"https://*.myapp.com", // Allow subdomains
		//		},
		//
		//		// Limited HTTP methods for security
		//		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		//
		//		// Minimal required headers only
		//		AllowedHeaders: []string{
		//			"Content-Type",
		//			"x-wails-client-id",
		//			"x-wails-window-name",
		//			"Authorization", // For authenticated requests
		//		},
		//
		//		// Longer cache time for production efficiency
		//		MaxAge: 24 * time.Hour,
		//	},
		//
		//	// Enable streaming for large data processing
		//	EnableStreaming: true,
		//},
		// NOTE: message handler for post messages
		RawMessageHandler: func(window application.Window, message string) {
			parsed := rawMessageHandlerMessage{}
			json.Unmarshal([]byte(message), &parsed)

			headers := make(http.Header)
			for key, value := range parsed.Headers {

				headers.Set(key, value)
			}
			headers.Set("x-wails-window-id", strconv.Itoa(int(window.ID())))

			parsedURL, _ := url.Parse(parsed.URL)

			request := &http.Request{
				Method: http.MethodGet,
				URL:    parsedURL,
				Header: headers,
			}

			messageProcessor.HandleRuntimeCallWithIDs(dummyResponseWriter, request)
		},
	})

	// Create a new window with the necessary options.
	// 'Title' is the title of the window.
	// 'Mac' options tailor the window when running on macOS.
	// 'BackgroundColour' is the background colour of the window.
	// 'URL' is the URL that will be loaded into the webview.
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Window 1",
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(27, 38, 54),
		// NOTE: you can switch between wails local or remote server here
		//URL:              "/",
		URL: "https://app-local.wails-awesome.io:3000/",
	})

	// Run the application. This blocks until the application has been exited.
	err := app.Run()

	// If an error occurred while running the application, log it and exit.
	if err != nil {
		log.Fatal(err)
	}
}
