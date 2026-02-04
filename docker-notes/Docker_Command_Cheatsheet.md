# Docker Commands Reference Guide

A comprehensive, easy-to-understand guide to Docker commands with practical examples, use cases, and explanations.

---

## Table of Contents
1. [Images](#1-docker-images)
2. [Containers](#2-docker-containers)
3. [Troubleshooting](#3-troubleshooting)
4. [Docker Hub](#4-docker-hub)
5. [Volumes](#5-docker-volumes)
6. [Networks](#6-docker-networks)

---

## 1. Docker Images

Docker images are blueprints/templates used to create containers. Think of them as a snapshot of your application and its dependencies.

### 1.1 List All Local Images
```bash
docker images
```
**What it does:** Displays all Docker images stored on your local machine.

**When to use:** When you need to check what images are available locally or verify if an image exists before running a container.

**Why use it:** To manage disk space, check image versions, and see which images are taking up storage.

---

### 1.2 Delete an Image
```bash
docker rmi <image_name>
```
**What it does:** Removes a specific Docker image from your local system.

**When to use:** When you no longer need an image or want to free up disk space.

**Why use it:** To clean up old or unused images and keep your system organized.

**Example:**
```bash
docker rmi nginx:latest
```

---

### 1.3 Remove Unused Images
```bash
docker image prune
```
**What it does:** Removes all dangling images (images not associated with any container).

**When to use:** After building multiple images or when you want to clean up your system.

**Why use it:** To automatically free up space without manually identifying unused images.

---

### 1.4 Build an Image from a Dockerfile
```bash
docker build -t <image_name>:<version> .
# version is optional
```
**What it does:** Creates a Docker image from instructions in a Dockerfile.

**When to use:** When you want to package your application into a Docker image.

**Why use it:** To create reproducible environments and distribute your application.

**Example:**
```bash
docker build -t myapp:1.0 .
docker build -t myapp .  # Without version (uses 'latest' by default)
```

---

### 1.5 Build Image Without Cache
```bash
docker build -t <image_name>:<version> . --no-cache
```
**What it does:** Builds an image without using cached layers from previous builds.

**When to use:** When you've made changes to dependencies or want a completely fresh build.

**Why use it:** To ensure all steps are executed fresh, avoiding potential issues from cached layers.

---

## 2. Docker Containers

Containers are running instances of Docker images. They are isolated environments where your application runs.

### 2.1 List All Containers (Running & Stopped)
```bash
docker ps -a
```
**What it does:** Shows all containers on your system, regardless of their state.

**When to use:** When you need to see all containers, including stopped ones.

**Why use it:** To get a complete overview of your containers and their status.

---

### 2.2 List All Running Containers
```bash
docker ps
```
**What it does:** Displays only currently running containers.

**When to use:** When you want to quickly check which containers are active.

**Why use it:** To monitor active containers and their resource usage.

---

### 2.3 Create & Run a New Container
```bash
docker run <image_name>
# If image not available locally, it'll be downloaded from DockerHub
```
**What it does:** Creates and starts a new container from an image.

**When to use:** When you want to start your application or service.

**Why use it:** To run your application in an isolated environment.

**Example:**
```bash
docker run nginx
```

---

### 2.4 Run Container in Background (Detached Mode)
```bash
docker run -d <image_name>
```
**What it does:** Runs a container in the background and returns the container ID.

**When to use:** When you want to run a service without blocking your terminal.

**Why use it:** To keep containers running while you continue working in the terminal.

**Example:**
```bash
docker run -d nginx
```

---

### 2.5 Run Container with Custom Name
```bash
docker run --name <container_name> <image_name>
```
**What it does:** Assigns a custom name to your container instead of a random one.

**When to use:** When you want to easily identify and reference your container.

**Why use it:** To make container management easier with meaningful names.

**Example:**
```bash
docker run --name my-nginx nginx
```

---

### 2.6 Port Binding in Container
```bash
docker run -p <host_port>:<container_port> <image_name>
```
**What it does:** Maps a port on your host machine to a port in the container.

**When to use:** When you need to access services running inside the container from your host.

**Why use it:** To make containerized applications accessible from outside the container.

**Example:**
```bash
docker run -p 8080:80 nginx
# Access nginx at localhost:8080
```

---

### 2.7 Set Environment Variables in Container
```bash
docker run -e <var_name>=<var_value> <container_name>
# or use <container_id>
```
**What it does:** Passes environment variables to the container at runtime.

**When to use:** When your application needs configuration values like API keys, database URLs, etc.

**Why use it:** To configure applications without hardcoding values in the image.

**Example:**
```bash
docker run -e DB_HOST=localhost -e DB_PORT=5432 myapp
```

---

### 2.8 Start or Stop an Existing Container
```bash
docker start <container_name>   # or <container_id>
docker stop <container_name>    # or <container_id>
```
**What it does:** Starts a stopped container or stops a running container.

**When to use:** When you need to control the state of existing containers.

**Why use it:** To manage containers without creating new ones each time.

**Example:**
```bash
docker start my-nginx
docker stop my-nginx
```

---

### 2.9 Inspect a Running Container
```bash
docker inspect <container_name>   # or <container_id>
```
**What it does:** Returns detailed information about a container in JSON format.

**When to use:** When you need to debug or get detailed configuration information.

**Why use it:** To view network settings, volumes, environment variables, and other metadata.

---

### 2.10 Delete a Container
```bash
docker rm <container_name>   # or <container_id>
```
**What it does:** Removes a stopped container from your system.

**When to use:** When you no longer need a container and want to clean up.

**Why use it:** To free up resources and keep your system organized.

**Example:**
```bash
docker rm my-nginx
```

---

## 3. Troubleshooting

### 3.1 Fetch Logs of a Container
```bash
docker logs <container_name>   # or <container_id>
```
**What it does:** Displays the logs from a container's stdout and stderr.

**When to use:** When debugging application issues or monitoring container behavior.

**Why use it:** To see what's happening inside your container without entering it.

**Example:**
```bash
docker logs my-nginx
docker logs -f my-nginx  # Follow logs in real-time
```

---

### 3.2 Open Shell Inside Running Container
```bash
docker exec -it <container_name> /bin/bash
# or
docker exec -it <container_name> sh
```
**What it does:** Opens an interactive shell session inside a running container.

**When to use:** When you need to inspect files, run commands, or debug inside the container.

**Why use it:** To troubleshoot issues, verify configurations, or test commands in the container environment.

**Example:**
```bash
docker exec -it my-nginx /bin/bash
# Now you're inside the container's shell
```

---

## 4. Docker Hub

Docker Hub is a cloud-based registry where you can store and share Docker images.

### 4.1 Pull an Image from Docker Hub
```bash
docker pull <image_name>
```
**What it does:** Downloads a Docker image from Docker Hub to your local machine.

**When to use:** When you need an image but don't want to build it yourself.

**Why use it:** To use pre-built images created by others.

**Example:**
```bash
docker pull nginx:latest
docker pull postgres:15
```

---

### 4.2 Publish an Image to Docker Hub
```bash
docker push <username>/<image_name>
```
**What it does:** Uploads your local image to Docker Hub.

**When to use:** When you want to share your image with others or use it on different machines.

**Why use it:** To distribute your application or back up your images.

**Example:**
```bash
docker push myusername/myapp:1.0
```

---

### 4.3 Login to Docker Hub
```bash
docker login -u <username>
# or
docker login
# Enter username and password when prompted

# To logout:
docker logout
```
**What it does:** Authenticates your Docker CLI with Docker Hub.

**When to use:** Before pushing images to Docker Hub.

**Why use it:** To access private repositories or push images.

---

### 4.4 Search for an Image on Docker Hub
```bash
docker search <image_name>
```
**What it does:** Searches Docker Hub for images matching your query.

**When to use:** When looking for available images for a specific technology.

**Why use it:** To discover official and community images.

**Example:**
```bash
docker search mongodb
```

---

## 5. Docker Volumes

Volumes are used to persist data generated by containers. They exist outside the container lifecycle.

### 5.1 List All Volumes
```bash
docker volume ls
```
**What it does:** Displays all Docker volumes on your system.

**When to use:** When you need to check existing volumes or verify volume creation.

**Why use it:** To manage storage and see what data is being persisted.

---

### 5.2 Create New Named Volume
```bash
docker volume create <volume_name>
```
**What it does:** Creates a named volume that can be used by containers.

**When to use:** Before running a container that needs persistent storage.

**Why use it:** To explicitly create volumes with meaningful names.

**Example:**
```bash
docker volume create postgres-data
```

---

### 5.3 Delete a Named Volume
```bash
docker volume rm <volume_name>
```
**What it does:** Removes a specific volume from your system.

**When to use:** When you no longer need the data stored in a volume.

**Why use it:** To clean up and free disk space.

**Example:**
```bash
docker volume rm postgres-data
```

---

### 5.4 Mount Named Volume with Running Container
```bash
docker run --volume <volume_name>:<mount_path> <image_name>
# or using --mount
docker run --mount type=volume,src=<volume_name>,dst=<mount_path> <image_name>
```
**What it does:** Attaches a named volume to a specific path inside the container.

**When to use:** When you need to persist database data, configuration files, or any other data.

**Why use it:** To ensure data survives container restarts and deletions.

**Example:**
```bash
docker run -v postgres-data:/var/lib/postgresql/data postgres
```

---

### 5.5 Mount Anonymous Volume with Running Container
```bash
docker run --volume <mount_path> <image_name>
```
**What it does:** Creates and mounts an unnamed volume to the container.

**When to use:** When you need temporary persistence but don't need to reference the volume by name.

**Why use it:** For quick testing or when you don't need to reuse the volume.

**Example:**
```bash
docker run -v /var/lib/postgresql/data postgres
```

---

### 5.6 Create a Bind Mount
```bash
docker run --volume <host_path>:<container_path> <image_name>
# or using --mount
docker run --mount type=bind,src=<host_path>,dst=<container_path> <image_name>
```
**What it does:** Mounts a directory or file from your host machine into the container.

**When to use:** During development when you want live code changes reflected in the container.

**Why use it:** To sync files between host and container in real-time.

**Example:**
```bash
docker run -v /c/Users/myuser/project:/app node
# Changes in /c/Users/myuser/project appear in /app inside container
```

---

### 5.7 Remove Unused Local Volumes
```bash
docker volume prune
# For anonymous volumes
```
**What it does:** Removes all volumes not currently used by any container.

**When to use:** When cleaning up your system.

**Why use it:** To free up disk space automatically.

---

## 6. Docker Networks

Networks allow containers to communicate with each other and the outside world.

### 6.1 List All Networks
```bash
docker network ls
```
**What it does:** Shows all Docker networks on your system.

**When to use:** When you need to see available networks or verify network creation.

**Why use it:** To manage container networking and troubleshoot connectivity issues.

---

### 6.2 Create a Network
```bash
docker network create <network_name>
```
**What it does:** Creates a custom Docker network.

**When to use:** When you need containers to communicate with each other.

**Why use it:** To isolate container communication and improve security.

**Example:**
```bash
docker network create my-app-network
```

---

### 6.3 Remove a Network
```bash
docker network rm <network_name>
```
**What it does:** Deletes a specific Docker network.

**When to use:** When you no longer need a custom network.

**Why use it:** To clean up unused networks.

**Example:**
```bash
docker network rm my-app-network
```

---

### 6.4 Remove All Unused Networks
```bash
docker network prune
```
**What it does:** Removes all networks not being used by any container.

**When to use:** During system cleanup.

**Why use it:** To automatically remove unused networks and keep your system organized.

---

## Quick Tips

1. **Use `--help` flag:** Add `--help` to any command to see detailed options
   ```bash
   docker run --help
   ```

2. **Container ID shortcuts:** You only need the first few characters of a container ID
   ```bash
   docker stop a1b2c3  # Instead of full ID: a1b2c3d4e5f6...
   ```

3. **Combine flags:** You can combine multiple flags in one command
   ```bash
   docker run -d -p 8080:80 --name my-nginx nginx
   ```
   -

4. **Clean up everything:** Remove all stopped containers, unused networks, dangling images
   ```bash
   docker system prune
   ```

---

**Last Updated:** February 2026
