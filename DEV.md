# Developing

## Local Dev Setup

- make sure node.js is installed
- make sure aicsimage python lib is installed
- npm install
- npm start
- entry points:
  - localhost:9020/index.html?files=//allen/aics/path/to/dir/with/ome/tif/files
  - localhost:9020/index.html?img=//allen/aics/path/to/ome/tif/file
- supports ome.tif, .tif, and .czi provided they are self contained z stacks.
- note: the files will be placed in a temporary "cache" folder which should be periodically cleaned out.

## Deployment

After updating versionsets in ansible-platform
```bash
source ~/virtualenvs/ansible-2.4.0/bin/activate
ansible-playbook -i inventory/staging.ini pb_docker_image_viewer.yaml
```
