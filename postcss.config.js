import postcssPxToRem from 'postcss-pxtorem'
import postcssPresetEnv from 'postcss-preset-env'

export default ({ env }) => {
  const isProd = env === 'production'
  const plugins = []

  if (isProd) {
    plugins.push(
      postcssPxToRem({
        propList: ['*'],
        mediaQuery: true,
      }),
      postcssPresetEnv({
        stage: 3,
        autoprefixer: true,
        browsers: 'defaults',
      }),
    )
  }

  return {
    plugins,
  }
}
