package apiserver

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"

	"github.com/GeertJohan/go.rice"
	"github.com/bitrise-io/bitrise-workflow-editor/apiserver/config"
	"github.com/bitrise-io/bitrise-workflow-editor/apiserver/service"
	"github.com/bitrise-io/bitrise-workflow-editor/apiserver/utility"
	"github.com/bitrise-io/go-utils/log"
	"github.com/gorilla/mux"
)

func setupRoutes(isServeFilesThroughMiddlemanServer bool) error {
	r := mux.NewRouter()

	r.HandleFunc("/api/bitrise-yml", wrapHandlerFunc(service.GetBitriseYMLHandler)).Methods("GET")
	r.HandleFunc("/api/bitrise-yml", wrapHandlerFunc(service.PostBitriseYMLHandler)).Methods("POST")

	r.HandleFunc("/api/bitrise-yml.json", wrapHandlerFunc(service.GetBitriseYMLAsJSONHandler)).Methods("GET")
	r.HandleFunc("/api/bitrise-yml.json", wrapHandlerFunc(service.PostBitriseYMLFromJSONHandler)).Methods("POST")

	r.HandleFunc("/api/secrets", wrapHandlerFunc(service.GetSecretsAsJSONHandler)).Methods("GET")
	r.HandleFunc("/api/secrets", wrapHandlerFunc(service.PostSecretsYMLFromJSONHandler)).Methods("POST")

	r.HandleFunc("/api/default-outputs", wrapHandlerFunc(service.GetDefaultOutputsHandler)).Methods("GET")

	r.HandleFunc("/api/spec", wrapHandlerFunc(service.PostSpecHandler)).Methods("POST")
	r.HandleFunc("/api/step-info", wrapHandlerFunc(service.PostStepInfoHandler)).Methods("POST")

	r.HandleFunc("/api/close", wrapHandlerFunc(service.DeleteCloseHandler)).Methods("DELETE")

	// Anything else: pass to the frontend
	if isServeFilesThroughMiddlemanServer {
		frontendServerHost := utility.EnvString("MIDDLEMAN_SERVER_HOST", config.DefaultFrontendHost)
		frontendServerPort := utility.EnvString("MIDDLEMAN_SERVER_PORT", config.DefaultFrontendPort)

		log.Printf("Starting reverse proxy for frontend => http://%s:%s", frontendServerHost, frontendServerPort)

		u, err := url.Parse("http://" + frontendServerHost + ":" + frontendServerPort + "/")
		if err != nil {
			return fmt.Errorf("Failed to initialize frontend proxy URL, error: %s", err)
		}
		r.NotFoundHandler = httputil.NewSingleHostReverseProxy(u)
	} else {
		box := rice.MustFindBox("www")
		r.NotFoundHandler = http.FileServer(box.HTTPBox())
	}
	//

	http.Handle("/", r)

	return nil
}

func wrapHandlerFunc(h func(http.ResponseWriter, *http.Request)) func(http.ResponseWriter, *http.Request) {
	requestWrap := func(w http.ResponseWriter, req *http.Request) {
		startTime := time.Now()
		h(w, req)

		log.Printf(" => %s: %s - %s (%s)", req.Method, req.RequestURI, time.Since(startTime), req.Header.Get("Content-Type"))
	}
	return requestWrap
}
