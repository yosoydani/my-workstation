# #/bin/bahs

# Fail inmediately if anny erros occur

set -e
echo
echo "################################################################"
echo "  Setup Workstation                                             "
echo "################################################################"
echo
echo "Caching [sudo] password..."
sudo -K
sudo true
echo
echo "################################################################"
echo "  Updating the system                                           "
echo "################################################################"
echo

# Upgrade

sudo apt update
sudo apt full-upgrade -y
echo
echo "################################################################"
echo "  Installing requirements for repositories                      "
echo "################################################################"
echo
cd software
sh install-google-chrome.sh
sh install-visual-studio-code.sh
sh install-gitkraken.sh
sh install-virtualbox.sh
sh install-dbeaver.sh
sh install-git.sh
sh install-anydesk.sh
sh install-curl.sh
sh install-docker.sh
sh install-htop.sh
sh install-file-systems.sh
sh install-filezilla.sh
sh install-gnome-applications.sh
sh install-net-tools.sh
sh install-traceroute.sh
sh install-nvm.sh
sh install-remmina.sh
sh install-flameshot.sh
cd ..

#Docker images

echo
echo "################################################################"
echo "  Creating local php image                                      "
echo "################################################################"
echo

docker build -t local-php ./images/php/

#alias

echo
echo "################################################################"
echo "  Creating alias                                                "
echo "################################################################"
echo


cp .bash_aliases ~

echo "Actualiza los alias ejecutando source .bash_aliases"

# directorio code

echo
echo "################################################################"
echo "  Creating code folder                                          "
echo "################################################################"
echo
cd ~
mkdir code

