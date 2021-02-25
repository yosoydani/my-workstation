#!/bin/bash

echo
echo "################################################################"
echo "  Installing Remmina                                      "
echo "################################################################"
echo

repositories=$(grep ^[^#] /etc/apt/sources.list /etc/apt/sources.list.d/*)
if ! repository=$(echo "$repositories" | grep "remmina"); then
    sudo apt-add-repository ppa:remmina-ppa-team/remmina-next
    sudo apt update
fi
if ! location=$(type -p "remmina"); then
    sudo apt install remmina remmina-plugin-rdp remmina-plugin-secret
fi

