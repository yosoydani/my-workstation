#/bin/bahs

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


./software/install-google-chrome.sh
./software/install-visual-studio-code.sh
./software/install-gitkraken.sh
./software/install-virtualbox.
./software/install-dbeaver.sh
./software/install-git.sh
./software/install-anydesk.sh
./software/install-curl.sh
./software/install-docker.sh
./software/install-htop.sh
./software/install-file-systems.sh
./software/install-filezilla.sh
./software/install-gnome-applications.sh
./software/install-net-tools.sh
./software/install-traceroute.sh
./software/install-nvm.sh


echo
echo "################################################################"
echo "  Creating code folder                                          "
echo "################################################################"
echo

cd ~
mkdir code