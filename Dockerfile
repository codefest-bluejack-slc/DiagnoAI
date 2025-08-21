# Use Ubuntu as base
FROM ubuntu:22.04

# Install base dependencies and Node.js 22
RUN apt-get update && apt-get install -y \
    curl git bash build-essential pkg-config libssl-dev \
    ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Verify versions
RUN node -v && npm -v

# Non-interactive install of dfx
ENV DFXVM_INIT_YES=1
RUN curl -fsSL https://sdk.dfinity.org/install.sh | bash

# Move dfx into PATH
ENV PATH="/root/.local/share/dfx/bin:${PATH}"
RUN cp /root/.local/share/dfx/bin/dfx /usr/local/bin/dfx

# Install ic-mops globally
RUN npm install -g ic-mops

# Create app directory
WORKDIR /ic

# Copy project files
COPY . .

RUN chmod +x setup.sh
RUN ./setup.sh

RUN npm run build

# Expose ports
EXPOSE 4943
EXPOSE 3000

CMD ["npm", "run", "start"]
