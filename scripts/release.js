#!/usr/bin/env node
/**
 * MEDIX Release Script
 * Usage: node scripts/release.js [patch|minor|major]
 * Default: patch
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(__dirname, '..');

const bumpType = process.argv[2] || 'patch';

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  if (type === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  } else if (type === 'minor') {
    parts[1]++;
    parts[2] = 0;
  } else {
    parts[2]++;
  }
  return parts.join('.');
}

// 1. Read current version
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const oldVersion = pkg.version;
const newVersion = bumpVersion(oldVersion, bumpType);

console.log(`\n🚀 Releasing MEDIX v${newVersion} (was v${oldVersion})\n`);

// 2. Update package.json
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✅ package.json → ${newVersion}`);

// 3. Update tauri.conf.json
const tauriConfPath = path.join(root, 'src-tauri', 'tauri.conf.json');
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
console.log(`✅ tauri.conf.json → ${newVersion}`);

// 4. Update updates.json
const updatesPath = path.join(root, 'updates.json');
const updates = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
updates.version = newVersion;
updates.pub_date = new Date().toISOString();
updates.notes = `Release v${newVersion}`;

// Update platform URLs to new version
const platforms = ['windows-x86_64', 'darwin-x86_64', 'darwin-aarch64', 'linux-x86_64'];
for (const platform of platforms) {
  if (updates.platforms[platform]?.url) {
    updates.platforms[platform].url = updates.platforms[platform].url
      .replace(/v\d+\.\d+\.\d+/g, `v${newVersion}`)
      .replace(/\d+\.\d+\.\d+/g, newVersion);
  }
}
fs.writeFileSync(updatesPath, JSON.stringify(updates, null, 2) + '\n');
console.log(`✅ updates.json → ${newVersion}`);

// 5. Git commit
console.log('\n📦 Committing version bump...');
try {
  execSync('git add -A', { cwd: root, stdio: 'inherit' });
  execSync(`git commit -m "release: v${newVersion}"`, { cwd: root, stdio: 'inherit' });
  execSync('git push origin main', { cwd: root, stdio: 'inherit' });
  console.log(`✅ Pushed to GitHub`);
} catch (e) {
  console.log('⚠️ Git commit/push skipped or failed');
}

// 6. Instructions
console.log(`
========================================
🎉 Release v${newVersion} prepared!
========================================

Next steps:
1. Run the build on each OS:

   Linux (this machine):
   npm run tauri:build

   Windows (on a Windows PC):
   npm run tauri:build

   Mac (on a Mac):
   npm run tauri:build

2. Upload the generated files to GitHub Releases:
   https://github.com/lacrous/MEDIX/releases/new?tag=v${newVersion}

   Files to upload:
   - src-tauri/target/release/bundle/appimage/MEDIX_${newVersion}_amd64.AppImage
   - src-tauri/target/release/bundle/deb/MEDIX_${newVersion}_amd64.deb
   - src-tauri/target/release/bundle/rpm/MEDIX-${newVersion}-1.x86_64.rpm
   - (Windows) src-tauri/target/release/bundle/msi/*.msi
   - (Windows) src-tauri/target/release/bundle/nsis/*.exe
   - (Mac) src-tauri/target/release/bundle/dmg/*.dmg

3. After uploading, users will automatically get the update!

========================================
`);
