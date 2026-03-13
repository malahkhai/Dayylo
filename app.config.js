export default ({ config }) => {
    return {
        ...config,
        ios: {
            ...config.ios,
            // EAS Build will provide the path to the GoogleService-Info.plist in the GOOGLE_SERVICES_INFO_PLIST env var
            googleServicesFile: process.env.GOOGLE_SERVICES_INFO_PLIST || config.ios.googleServicesFile,
        },
        android: {
            ...config.android,
            // Similarly for Android if needed in the future
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON || config.android.googleServicesFile,
        }
    };
};
