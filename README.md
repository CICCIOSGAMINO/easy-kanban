Easy Kanban
===========
[TOC]

v0.9.3 - Jan 2026

A simple and easy to use Kanban board application built with web technologies. Just born to handle clients and steps, configure the data json files and start to use it!

# Getting Started

```bash
cd easy-kanban
npm install
npm run start
```

# Hardware & Node.js
Test on Raspberry Pi 4 with 4GB RAM, running Ubuntu 25.10 Server 64-bit

```bash
sudo apt install rpi-imager

# Flash Ubuntu 25.10 Server 64-bit to an SD card
rpi-imager  
# set the WI-Fi SSID and Password
# set the user name and password to connect via SSH

# First boot setup
ssh ubuntu@<raspberry-pi-ip-address>

# install nodejs
wget https://nodejs.org/dist/v24.12.0/node-v24.12.0-linux-arm64.tar.xz
sudo tar -xJf node-v24.12.0-linux-arm64.tar.xz -C /usr --strip-components=1

# download the zip package of easy-kanban
wget https://github.com/CICCIOSGAMINO/easy-kanban/archive/refs/heads/main.zip
unzip main.zip

cd easy-kanban-main
npm install

# run easy-kanban
npm run start


kanban.local  ciccio <psw>  10.240.206.76
```


# Illustrations
https://undraw.co/illustrations

# Icons
https://material.io/resources/icons/