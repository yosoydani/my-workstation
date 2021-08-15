#!/bin/bash

echo
echo "################################################################"
echo "  Installing Postman                                               "
echo "################################################################"
echo

if ! location=$(type -p "postman"); then
  	snap install postman
fi