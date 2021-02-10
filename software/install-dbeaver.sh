#!/bin/bash

echo
echo "################################################################"
echo "  Installing dbeaver                                            "
echo "################################################################"
echo

if ! location=$(type -p "dbeaver-ce"); then
    wget https://dbeaver.io/files/dbeaver-ce_latest_amd64.deb
    sudo dpkg -i dbeaver-ce_latest_amd64.deb
    rm dbeaver-ce_latest_amd64.deb
fi