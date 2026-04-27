#!/bin/bash

# Configuration - FILL THESE IN
EC2_IP="YOUR_EC2_PUBLIC_IP"
PEM_PATH="YOUR_PEM_FILE_PATH"
USER="ubuntu"

if [ "$EC2_IP" == "YOUR_EC2_PUBLIC_IP" ]; then
    echo "Please edit this script and set your EC2_IP and PEM_PATH."
    exit 1
fi

echo "Uploading files to $EC2_IP..."

# Upload server files (excluding node_modules)
scp -i "$PEM_PATH" -r server/package.json server/server.ts server/tsconfig.json server/routes server/models server/middleware server/controllers server/interfaces server/config server/.env "$USER@$EC2_IP:~/app/server/"

# Upload client build
scp -i "$PEM_PATH" -r client/dist "$USER@$EC2_IP:~/app/client/"

# Upload setup script
scp -i "$PEM_PATH" setup_ec2.sh "$USER@$EC2_IP:~/"

echo "Upload complete. Now SSH into your instance and run setup_ec2.sh:"
echo "ssh -i \"$PEM_PATH\" $USER@$EC2_IP"
echo "cd ~/ && bash setup_ec2.sh"
echo "cd ~/app/server && npm install && npm run build && pm2 start dist/server.js --name grocery-app"
