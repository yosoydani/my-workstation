#!/bin/bash

echo
echo "################################################################"
echo "  Installing Gitkraken                                          "
echo "################################################################"
echo

if ! location=$(type -p "gitkraken"); then
    wget https://release.gitkraken.com/linux/gitkraken-amd64.deb
    sudo dpkg -i gitkraken-amd64.deb
fi