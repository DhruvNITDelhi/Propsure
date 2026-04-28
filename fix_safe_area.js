const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Check if file imports SafeAreaView from react-native
      if (content.includes('SafeAreaView') && content.includes("'react-native'")) {
        // Remove SafeAreaView from react-native import
        content = content.replace(/SafeAreaView,\s*/g, '');
        content = content.replace(/,\s*SafeAreaView/g, '');
        // If the import was just { SafeAreaView }, this might leave {} but usually there are other imports.
        
        // Add SafeAreaView import from react-native-safe-area-context
        if (!content.includes("'react-native-safe-area-context'")) {
           content = "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content;
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDirectory(appDir);
