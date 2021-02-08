#!/bin/bash

echo
echo "################################################################"
echo "  Installing Virtualbox                                         "
echo "################################################################"
echo

if ! location=$(type -p "virtualbox"); then
    sudo apt install virtualbox
fi
