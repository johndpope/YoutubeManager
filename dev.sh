#!/bin/bash
echo "Nossa! Estou vivo!"

function_babel(){
	./node_modules/.bin/babel --watch source/javascript --out-dir build
}

function_node(){
	npm run server
}

function_babel & function_node