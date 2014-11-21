JSX=$(shell npm root)/.bin/jsx
BROWSERIFY=$(shell npm root)/.bin/browserify
BOOTSTRAP=$(shell node -e "process.stdout.write(require.resolve('bootstrap/dist/css/bootstrap.css'))")
SOURCEFILES=lib/*.js

all: build

build:
	$(JSX) --harmony src/ lib/

demo: build
	mkdir -p example/output/

	$(BROWSERIFY) -t [ reactify --harmony ] example/demo.js > example/output/bundle.js
	cp $(BOOTSTRAP) example/output/
