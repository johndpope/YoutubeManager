#!/bin/bash
echo "Nossa! Estou vivo!"

function_babel(){
	./node_modules/.bin/babel --watch source/javascript --out-dir build
}

function_node(){
	npm run server
}

function_less(){
	./node_modules/.bin/lessc source/index.less build/index.css;
}

trap 'kill %1;' SIGINT;
./node_modules/.bin/grunt build && (npm run server & ./node_modules/.bin/grunt watch)