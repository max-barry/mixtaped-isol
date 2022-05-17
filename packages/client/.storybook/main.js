const { join } = require("path");

const webpack = require("webpack");
const dotenv = require("dotenv");

const env = dotenv.config({ path: join(__dirname, "../../../.env") });
const envLocal = dotenv.config({
  override: true,
  path: join(__dirname, "../../../.env.local")
});

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app"
  ],
  framework: "@storybook/react",
  core: { builder: "@storybook/builder-webpack5" },
  staticDirs: ["../public"],
  features: { emotionAlias: false },
  /**
   * Overload for Storybook's flakey env var loading
   * @see {@link https://github.com/storybookjs/storybook/issues/12270#issuecomment-897256202}
   */
  webpackFinal: config => {
    const envVarsToInject = { ...env.parsed, ...envLocal.parsed };
    const hasEnvVarsToInject = Object.keys(envVarsToInject).length > 0;

    config.plugins = config.plugins.reduce((c, plugin) => {
      /** If DefinePlugin */
      if (plugin instanceof webpack.DefinePlugin && hasEnvVarsToInject) {
        /** Update the processEnv with what we parsed */
        const processEnv = { ...plugin.definitions["process.env"] };
        Object.keys(envVarsToInject).forEach(
          key => (processEnv[key] = JSON.stringify(envVarsToInject[key]))
        );
        plugin.definitions["process.env"] = processEnv;
        /** Perform a fresh definition using the updated definitions */
        return [...c, new webpack.DefinePlugin(plugin.definitions)];
      }

      return [...c, plugin];
    }, []);

    return config;
  }
};
