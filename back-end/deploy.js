#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Deploy GAS script and automatically update deployment ID in vite.config.js
 */
function deployAndUpdateConfig() {
  try {
    console.log('🚀 Deploying Google Apps Script...');
    
    // Run clasp deploy and capture output
    let deployOutput;
    try {
      deployOutput = execSync('clasp deploy', { encoding: 'utf-8' });
    } catch (error) {
      // Check if error is due to deployment limit
      if (error.message.includes('20 versioned deployments')) {
        console.log('⚠️  Deployment limit reached. Cleaning up old deployments...');
        
        // Get list of deployments
        const deploymentsOutput = execSync('clasp deployments', { encoding: 'utf-8' });
        
        // Extract deployment IDs (keep only HEAD)
        const deploymentLines = deploymentsOutput.split('\n').filter(line => line.includes('AKfycb'));
        
        if (deploymentLines.length > 1) {
          // Delete all but the HEAD deployment
          const headDeployment = deploymentLines[0].match(/AKfycb\S+/)[0];
          
          console.log(`Keeping HEAD deployment: ${headDeployment}`);
          
          for (let i = 1; i < deploymentLines.length; i++) {
            const deployId = deploymentLines[i].match(/AKfycb\S+/)[0];
            console.log(`Deleting old deployment: ${deployId}`);
            try {
              execSync(`clasp undeploy ${deployId} --all`, { encoding: 'utf-8' });
            } catch (e) {
              // Continue on error
            }
          }
        }
        
        // Try deploying again
        console.log('🚀 Retrying deployment...');
        deployOutput = execSync('clasp deploy', { encoding: 'utf-8' });
      } else {
        throw error;
      }
    }
    
    // Extract deployment ID from output
    // Output format: "Deployed {DEPLOYMENT_ID} @{VERSION}"
    const deploymentIdMatch = deployOutput.match(/Deployed\s+(\S+)\s+@/);
    
    if (!deploymentIdMatch || !deploymentIdMatch[1]) {
      throw new Error('Could not extract deployment ID from clasp output:\n' + deployOutput);
    }
    
    const newDeploymentId = deploymentIdMatch[1];
    console.log(`✅ Got new deployment ID: ${newDeploymentId}`);
    
    // Update vite.config.js
    const viteConfigPath = path.join(__dirname, '..', 'front-end', 'vite.config.js');
    let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
    
    // Replace the deployment ID
    viteConfig = viteConfig.replace(
      /const deploymentId = ".*?"/,
      `const deploymentId = "${newDeploymentId}"`
    );
    
    fs.writeFileSync(viteConfigPath, viteConfig, 'utf-8');
    console.log(`✅ Updated vite.config.js with new deployment ID`);
    
    console.log('\n✨ Deployment complete!');
    console.log(`📍 Deployment ID: ${newDeploymentId}`);
    console.log(`📍 URL: https://script.google.com/macros/s/${newDeploymentId}/exec`);
    
  } catch (error) {
    console.error('❌ Error during deployment:', error.message);
    process.exit(1);
  }
}

// Run the deployment
deployAndUpdateConfig();
