#!/bin/bash

echo
echo "################################################################"
echo "  Installing dropbox                                            "
echo "################################################################"
echo

if ! location=$(type -p "dropbox"); then
    wget -O dropbox.deb https://www.dropbox.com/download?dl=packages/ubuntu/dropbox_2020.03.04_amd64.deb
    sudo dpkg -i dropbox.deb
    rm dropbox.deb
fi