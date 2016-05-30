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

trap 'kill %1; kill %2;' SIGINT;
function_less & function_babel & function_node