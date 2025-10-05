SHELL:=/bin/bash

setup-local-ssl:
	grep 'app-local.wails-awesome.io' /etc/hosts || echo '127.0.0.1 app-local.wails-awesome.io' | sudo tee -a /etc/hosts
	brew install mkcert
	mkcert -install
	mkdir -p ./frontend/ssl
	cd ./frontend/ssl && mkcert "*.wails-awesome.io" localhost 127.0.0.1
	cd ./frontend/ssl && cat _wildcard.wails-awesome.io+2-key.pem _wildcard.wails-awesome.io+2.pem > server.pem

