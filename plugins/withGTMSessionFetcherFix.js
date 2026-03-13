const { withDangerousMod, withAppDelegate, withEntitlementsPlist } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Custom Expo Config Plugin to:
 * 1. Fix GTMSessionFetcher header visibility issues.
 * 2. Inject React-Core header search paths into Firebase pods.
 * 3. Disable strict modularity for Objective-C Firebase modules.
 * 4. Inject Firebase initialization into AppDelegate.swift.
 * 5. Enable Keychain Sharing entitlement (Fixes [auth/internal-error] on simulators).
 */
const withGTMSessionFetcherFix = (config) => {
  // 1. Podfile modification (Existing structural fixes)
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');
      if (!fs.existsSync(podfilePath)) return config;

      let contents = fs.readFileSync(podfilePath, 'utf8');

      const patch = `
    # --- Structural Fix for GTMSessionFetcher & React Header Visibility Start ---
    # This solves linkage issues in New Architecture + Static Frameworks
    pods_root = File.join(Pod::Config.instance.installation_root, 'Pods')
    gtm_source_path = File.join(pods_root, 'GTMSessionFetcher/Sources/Full/Public/GTMSessionFetcher')
    gtm_target_path = File.join(pods_root, 'Target Support Files/GTMSessionFetcher')
    
    if File.directory?(gtm_source_path) && File.directory?(gtm_target_path)
      require 'fileutils'
      Dir.glob(File.join(gtm_source_path, '*.h')).each do |header|
        FileUtils.cp(header, gtm_target_path)
      end
    end

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['HEADER_SEARCH_PATHS'] ||= '$(inherited) '
        config.build_settings['HEADER_SEARCH_PATHS'] << '"$(PODS_ROOT)/GTMSessionFetcher/Sources/Full/Public/GTMSessionFetcher" '
        config.build_settings['HEADER_SEARCH_PATHS'] << '"$(PODS_ROOT)/Headers/Public/React-Core" '
        
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
        
        if ['RNFBFirestore', 'RNFBApp', 'RNFBAuth'].include?(target.name)
          config.build_settings['DEFINES_MODULE'] = 'NO'
          config.build_settings['CLANG_ENABLE_MODULES'] = 'NO'
        end
        
        if ['GTMSessionFetcher'].include?(target.name)
          config.build_settings['DEFINES_MODULE'] = 'YES'
        end
      end
    end
    # --- Structural Fix End ---
`;

      if (!contents.includes('# --- Structural Fix for GTMSessionFetcher')) {
        if (contents.includes('post_install do |installer|')) {
          contents = contents.replace(
            'post_install do |installer|',
            "post_install do |installer|" + patch
          );
        } else if (contents.includes("target 'Dayylo' do")) {
          contents = contents.replace(
            "target 'Dayylo' do",
            "target 'Dayylo' do" + patch
          );
        }
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);

  // 2. AppDelegate modification (Inject Firebase Init)
  config = withAppDelegate(config, (config) => {
    if (config.modResults.language === 'swift') {
      let content = config.modResults.contents;
      if (!content.includes('import FirebaseCore')) {
        content = 'import FirebaseCore\n' + content;
      }
      if (!content.includes('FirebaseApp.configure()')) {
        const search = 'return super.application(application, didFinishLaunchingWithOptions: launchOptions)';
        if (content.includes(search)) {
          content = content.replace(search, `FirebaseApp.configure()\n    ${search}`);
        }
      }
      config.modResults.contents = content;
    }
    return config;
  });

  // 3. Entitlements modification (Enable Keychain Sharing)
  // This is required for Firebase Auth to persist sessions on iOS Simulators
  config = withEntitlementsPlist(config, (config) => {
    config.modResults['keychain-access-groups'] = [
      `$(AppIdentifierPrefix)${config.ios.bundleIdentifier}`,
    ];
    return config;
  });

  return config;
};

module.exports = withGTMSessionFetcherFix;
