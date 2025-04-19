{
  inputs = {
    nixpkgs.url = "nixpkgs";
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        # "aarch64-linux"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);

      makeDeps =
        pkgs: with pkgs; [
          biome # linting
          nodejs_23
        ];

      mkUtils =
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          deps = makeDeps pkgs;
          nodeModules = pkgs.mkYarnModules {
            pname = "chobble-template-dependencies";
            version = "1.0.1";
            packageJSON = ./package.json;
            yarnLock = ./yarn.lock;
            yarnFlags = [
              "--frozen-lockfile"
            ];
          };

          mkScript =
            name:
            let
              base = pkgs.writeScriptBin name (builtins.readFile ./bin/${name});
              patched = base.overrideAttrs (old: {
                buildCommand = "${old.buildCommand}\n patchShebangs $out";
              });
            in
            pkgs.symlinkJoin {
              inherit name;
              paths = [ patched ] ++ deps;
              buildInputs = [ pkgs.makeWrapper ];
              postBuild = ''
                wrapProgram $out/bin/${name} --prefix PATH : $out/bin
              '';
            };

          scripts = builtins.attrNames (builtins.readDir ./bin);

          scriptPkgs = builtins.listToAttrs (
            map (name: {
              inherit name;
              value = mkScript name;
            }) scripts
          );
        in
        {
          inherit
            pkgs
            deps
            mkScript
            scripts
            scriptPkgs
            nodeModules
            ;
        };
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgsFor = mkUtils system;
        in
        (with pkgsFor; {
          inherit site nodeModules;
        })
        // pkgsFor.scriptPkgs
      );

      defaultPackage = forAllSystems (system: self.packages.${system}.site);
      devShells = forAllSystems (
        system:
        let
          pkgsFor = mkUtils system;
        in
        rec {
          default = dev;
          dev = pkgsFor.pkgs.mkShell {
            buildInputs = pkgsFor.deps ++ (builtins.attrValues pkgsFor.scriptPkgs);

            shellHook = ''
              rm -rf node_modules
              cp -r ${pkgsFor.nodeModules}/node_modules .
              chmod -R +w ./node_modules
              cat <<EOF

              Development environment ready!

              Available commands:
               - 'serve'      - Start development server
               - 'build'      - Build the site in the _site directory
               - 'dryrun'     - Perform a dry run build
               - 'test_flake' - Test building a site using flake.nix
               - 'lint'       - Lint all files in src using Biome

              EOF

              git pull
            '';
          };
        }
      );
    };
}
