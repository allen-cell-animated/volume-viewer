This is a vendored version of zarr.js from a pull request that patches an issue
with rejecting request promises.

Hopefully this is temporary until the issue is resolved.  
See https://github.com/gzuidhof/zarr.js/issues/140 and https://github.com/gzuidhof/zarr.js/pull/145 for more context.

Here is how this file was created:

1. clone https://github.com/az0uz/zarr.js/tree/az0uz/fix_async_error_passthrough
2. in the zarr js project, do this:
3. npm install
4. npm run prepublishOnly
5. npm pack
6. copy resulting .tgz file into this project
7. add file as dependency in package.json
8. npm install
