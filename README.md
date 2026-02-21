Easy Kanban
===========
[TOC]

v0.30.0 - Feb 2026

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

## Raspberry Pi 4 Configuration
Here the network configuration to set a static IP address on Raspberry Pi 4 running Ubuntu Server 25.10

```bash
sudo nano /etc/netplan/50-cloud-init.yaml
```

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
          metric: 100
      nameservers:
        addresses: [192.168.1.1, 8.8.8.8]
      dhcp4: no
  wifis:
    wlan0:
      dhcp4: yes
      dhcp4-overrides:
        route-metric: 200  # Higher metric = lower priority than ethernet
      access-points:
        "your-wifi-ssid":
          password: "your-wifi-password"
```


```bash
# Check what Netplan will generate
sudo netplan generate --debug
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

# Node.js and pm2 as a service
For Node.js applications, PM2 is often the best choice because:

- Automatic restart on crashes
- Log management
- Process monitoring
- Cluster mode for multiple cores
- Simple startup script generation 

Quick PM2 setup:

```bash
# Install PM2
sudo npm install -g pm2

# Start your app
pm2 start server.js --name kanban-app

# Generate and enable startup script
pm2 startup
# Run the command it outputs

# Save the process list
pm2 save

# Set PM2 to start on boot
pm2 resurrect
# To check if it's working after reboot:

bash
pm2 status
pm2 logs

# list, stop and restart application
pm2 list
pm2 stop node-kanban
pm2 restart node-kanban
```


# Illustrations
https://undraw.co/illustrations

# Icons
https://material.io/resources/icons/