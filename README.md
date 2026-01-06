Easy Kanban
===========
[TOC]

v0.13.0 - Jan 2026

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
```

# Nginx
Install HTTP server Nginx to reverse proxy the nodejs application, run as a service and enable HTTPS with Let's Encrypt or other services if you need.

// Nginx configuration file /etc/nginx/sites-available/easy-kanban

```nginx    
server {
    listen 80;
    server_name kanban.local;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo apt install nginx

# create the nginx config file with the content above
sudo nano /etc/nginx/sites-available/easy-kanban

# enable the site
sudo ln -s /etc/nginx/sites-available/easy-kanban /etc/nginx/sites-enabled/
# remove the default site
sudo rm /etc/nginx/sites-enabled/default

# test the configuration
sudo nginx -t

# restart nginx
sudo systemctl restart nginx
```


# Illustrations
https://undraw.co/illustrations

# Icons
https://material.io/resources/icons/