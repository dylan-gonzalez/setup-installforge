const core = require('@actions/core');
const toolCache = require('@actions/tool-cache');
const path = require('path');
const fs = require('fs');

async function run() {
  try {
    // Get inputs
    const version = core.getInput('version') || 'latest';
    const enableCache = core.getInput('cache') === 'true';
    
    // Check if we're running on Windows
    if (process.platform !== 'win32') {
      core.setFailed('InstallForge is only available for Windows. This action requires a Windows runner.');
      return;
    }

    core.info(`Setting up InstallForge version: ${version}`);

    // Check if InstallForge is already in cache
    let installForgePath = '';
    
    if (enableCache) {
      installForgePath = toolCache.find('installforge', version);
      if (installForgePath) {
        core.info(`Found InstallForge ${version} in cache at ${installForgePath}`);
        setupEnvironment(installForgePath, version);
        return;
      }
    }

    // Download InstallForge
    const downloadUrl = 'https://installforge.net/download/InstallForge.exe';
    core.info(`Downloading InstallForge from ${downloadUrl}`);
    
    const downloadPath = await toolCache.downloadTool(downloadUrl, 'InstallForge.exe');
    core.info(`Downloaded to ${downloadPath}`);

    // Create installation directory
    const installDir = path.join(process.env.RUNNER_TOOL_CACHE || process.env.RUNNER_TEMP, 'installforge');
    if (!fs.existsSync(installDir)) {
      fs.mkdirSync(installDir, { recursive: true });
    }

    // Copy the executable to the installation directory
    const installForgeBinary = path.join(installDir, 'InstallForge.exe');
    fs.copyFileSync(downloadPath, installForgeBinary);
    
    core.info(`InstallForge installed at ${installDir}`);

    // Add to cache if caching is enabled
    if (enableCache) {
      installForgePath = await toolCache.cacheDir(installDir, 'installforge', version);
      core.info(`Cached InstallForge at ${installForgePath}`);
    } else {
      installForgePath = installDir;
    }

    setupEnvironment(installForgePath, version);
    
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

function setupEnvironment(installForgePath, version) {
  // Add InstallForge to PATH
  core.addPath(installForgePath);
  core.info(`Added ${installForgePath} to PATH`);

  // Set outputs
  core.setOutput('installforge-version', version);
  core.setOutput('installforge-path', installForgePath);

  core.info('✓ InstallForge setup completed successfully');
}

if (require.main === module) {
  run();
}

module.exports = { run };