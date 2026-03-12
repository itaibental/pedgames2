{ pkgs, ... }: {
  # Use the stable channel for nixpkgs
  channel = "stable-24.05";

  # List of packages to install
  packages = [
    pkgs.nodejs_20  # Using Node.js version 20
  ];

  # Basic environment variables
  env = {};

  idx = {
    # VS Code extensions to install
    extensions = [
      "dbaeumer.vscode-eslint"  # For code linting
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Install npm dependencies
        npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Start the development server
        start-server = "node index.js";
      };
    };

    # Configure web previews
    previews = {
      enable = true;
      previews = {
        # Define a web preview for the application
        web = {
          command = ["node" "index.js"];
          manager = "web";
        };
      };
    };
  };
}
