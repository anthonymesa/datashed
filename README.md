# Datastream

When building the Docker image, the react application is built to the build directory. This process uses the environment variable HOMEPAGE_URL to set up the src links for assets in index.html relative to the path provided.

When deployed to github pages the HOMEPAGE_URL env variable (provided in .env.production) should be "https://anthonymesa.github.io/datastream". This makes it such that all assets are prefixed with "/datastream/" (e.g. /datastream/index.html).

When deploying to localhost or a subdomain without a path (e.g. datastream.snazzyfellas.com), then the HOMEPAGE_URL should be set appropriately (e.g. "http://localhost:80", "https://datastream.snazzyfellas.com/")