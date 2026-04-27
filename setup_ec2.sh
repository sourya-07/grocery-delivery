#!/ outbursts/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Create app directory
mkdir -p ~/app/client
mkdir -p ~/app/server/uploads

echo "Environment setup complete. You can now upload your files to ~/app."
