# Setup InstallForge

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue.svg)](https://github.com/marketplace/actions/setup-installforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A GitHub Action that downloads and sets up [InstallForge](https://installforge.net/), a free Windows installer creation tool.

## About InstallForge

InstallForge is a free and user-friendly tool for creating Windows executable setup packages. It offers:
- Wizard-driven interface with no scripting required
- Customizable graphics and splash screens
- Multilingual support (15+ languages)
- Various compression algorithms (LZMA, Deflate, bzip2, BriefLZ)
- Clean installation/uninstallation engine
- Modern Windows compatibility (Windows 10, 11, Server 2016+)

## Requirements

- **Windows runners only**: This action requires a Windows-based GitHub Actions runner since InstallForge is a Windows-only application.

## Usage

### Basic Usage

```yaml
name: Build Installer
on: [push]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup InstallForge
        uses: dylan-gonzalez/setup-installforge@v1
        
      - name: Create installer
        run: |
          # InstallForge is now available in PATH
          InstallForge.exe --help
```

### Advanced Usage

```yaml
name: Build Installer
on: [push]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup InstallForge
        uses: dylan-gonzalez/setup-installforge@v1
        with:
          version: 'latest'
          cache: true
        id: installforge
        
      - name: Verify InstallForge installation
        run: |
          echo "InstallForge version: ${{ steps.installforge.outputs.installforge-version }}"
          echo "InstallForge path: ${{ steps.installforge.outputs.installforge-path }}"
          
      - name: Build installer with your project
        run: |
          # Your installer creation commands here
          # InstallForge.exe [your-project-config]
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `version` | Version of InstallForge to install | No | `latest` |
| `cache` | Enable caching to speed up subsequent runs | No | `true` |

## Outputs

| Output | Description |
|--------|-------------|
| `installforge-version` | The version of InstallForge that was installed |
| `installforge-path` | Path where InstallForge was installed |

## Caching

This action supports caching to improve performance on subsequent workflow runs. Caching is enabled by default and will store the InstallForge installation based on the version requested.

To disable caching:

```yaml
- uses: dylan-gonzalez/setup-installforge@v1
  with:
    cache: false
```

## Example Workflows

### Simple Installer Build

```yaml
name: Build Windows Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build-installer:
    runs-on: windows-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup InstallForge
        uses: dylan-gonzalez/setup-installforge@v1
        
      - name: Build application
        run: |
          # Build your application here
          # dotnet build --configuration Release
          
      - name: Create installer
        run: |
          # Configure and run InstallForge
          # InstallForge.exe --project installer-config.ifp
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
- Open an issue in this repository
- Check the [InstallForge official documentation](https://installforge.net/docs/)

## Acknowledgments

- [InstallForge](https://installforge.net/) team for creating this excellent free tool
- GitHub Actions community for inspiration and best practices
