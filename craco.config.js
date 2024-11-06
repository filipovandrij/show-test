const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const isDevelopment = env === 'development'

      const entryPoints = {
        main: [
          isDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
          paths.appIndexJs,
        ].filter(Boolean),
        content: './src/chrome/content.ts',
        background: './src/chrome/background.ts',
        gmail: './src/chrome/gmail.ts',
        indeed: './src/chrome/indeed.ts',
        addFrame: './src/chrome/addFrame.ts',
        messageBus: './src/chrome/messageBus.tsx',
        linkedinProfile: './src/chrome/linkedinProfile/index.tsx',
        linkedinSearchButton: './src/chrome/linkedinSearchButton/index.tsx',
        SalesNavigatorSearchButton: './src/chrome/salesNavigatorSearchButton/index.tsx',
        linkedinJob: './src/chrome/linkedinJob/index.tsx',
        linkedinSearch: './src/chrome/linkedinSearch/index.tsx',
        googleSearch: './src/chrome/googleSearch/index.tsx',
        linkedinProfileForJob: './src/chrome/linkedinProfileForJob.ts',
        chatGPT: './src/chrome/chatGPT.ts',
        adzunaProfile: './src/chrome/adzunaProfile.ts',
        quickParse: './src/chrome/quickParse/quickParseContentScript.ts',
      }

      const htmlPlugin = new HtmlWebpackPlugin({
        inject: true,
        chunks: ['main'],
        template: paths.appHtml,
      })

      return {
        ...webpackConfig,
        entry: entryPoints,
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        plugins: [
          ...webpackConfig.plugins.filter((n) => n.constructor.name !== 'HtmlWebpackPlugin'),
          htmlPlugin,
        ],
      }
    },
  },
}
