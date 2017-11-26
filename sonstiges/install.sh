#!/bin/bash

if [[ $EUID -ne 0 ]];
    then
    	echo "This script must be run as root" 
   		exit 1
fi

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt install -y \
	curl \
	wget \
	build-essential \
	linux-image-extra-"$(uname -r)" \
    linux-image-extra-virtual \
    apt-transport-https \
    ca-certificates \
    software-properties-commo


curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install docker-ce nodejs