#!/bin/bash

timestamp=$(date +"%D %T")

heroku login


git add .

git commit -am "auto depoyment backend server $timestamp"

git push heroku master
