# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{pkgs}: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs
    pkgs.bun
    pkgs.openssl
  ];
  # Sets environment variables in the workspace
  env = {
    DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWjk0UVA5SzBQSzZLVzJROThTOE1aS1EiLCJ0ZW5hbnRfaWQiOiIyYjdjMjUxYjY4YWY5MWIxMjE0OWQyZGQzMTVjOTliOTY1NThjMzBmYjU5MWY1MzdmYjU4NzJlODI1Y2JhOTIxIiwiaW50ZXJuYWxfc2VjcmV0IjoiZmJjODUzM2QtOWZkNC00Yzg0LWIwZGUtMTFlZjk3ZGRiZjU3In0.MjuUfWACDD9PJ7oZMsDxsqPoJ2U4i7IgQaEY-h_bBBM";
  };
  # This adds a file watcher to startup the firebase emulators. The emulators will only start if
  # a firebase.json file is written into the user's directory
  services.firebase.emulators = {
    detect = true;
    projectId = "demo-app";
    services = ["auth" "firestore"];
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
       "Prisma.prisma"
    ];
    workspace = {
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
        ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
