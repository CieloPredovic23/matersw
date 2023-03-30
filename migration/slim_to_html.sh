#!/bin/bash

cd rails
bundle exec ruby transformer.rb slim < ../source/templates/$1.slim > $1.html
