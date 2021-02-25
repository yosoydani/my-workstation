#!/bin/bash

echo
echo "################################################################"
echo "  Installing nvm                                                "
echo "################################################################"
echo

if ! location=$(type -p "nvm"); then
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    nvm install --lts 
fi