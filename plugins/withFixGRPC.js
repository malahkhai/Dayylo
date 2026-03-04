const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withFixGRPC(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfile = path.join(config.modRequest.projectRoot, 'ios', 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf8');

      const fix = `
    installer.pods_project.targets.each do |target|
      # Fix deployment target warnings and non-modular header includes
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
      end

      if target.name.start_with?('RNFB')
        target.build_configurations.each do |config|
          config.build_settings['HEADER_SEARCH_PATHS'] ||= '$(inherited)'
          config.build_settings['HEADER_SEARCH_PATHS'] << ' "$(PODS_ROOT)/Headers/Public/React-Core"'
          config.build_settings['HEADER_SEARCH_PATHS'] << ' "$(PODS_ROOT)/Headers/Public/FirebaseCore"'
          config.build_settings['USE_HEADERMAP'] = 'NO'
        end
      end

      if target.name.include?('gRPC-Core') || target.name.include?('gRPC-C++')
        target.build_configurations.each do |config|
          config.build_settings['HEADER_SEARCH_PATHS'] ||= '$(inherited)'
          config.build_settings['HEADER_SEARCH_PATHS'] << ' "$(PODS_ROOT)/Headers/Private/grpc"'
        end
      end
    end`;

      contents = contents.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|\n${fix}`
      );
      fs.writeFileSync(podfile, contents);

      return config;
    },
  ]);
};
