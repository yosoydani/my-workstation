#!/bin/bash

echo
echo "################################################################"
echo "  Installing Flameshot                                         "
echo "################################################################"
echo

if ! location=$(type -p "flameshot"); then
    apt install flameshot
fi
