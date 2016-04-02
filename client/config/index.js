const configs = {
  global: {
    API_ROOT: '/api'
  },
  production: {

  },
  development: {

  },
}

const globalConfig = configs.global
const envConfig = configs[process.env.NODE_ENV]

// Copy global and environment config into exports
Object.assign(module.exports, globalConfig, envConfig)

if (process.env.NODE_ENV === 'development') {
  // Attempt to load and copy over the local config, if it exists...
  try {
    const localConfig = require('./local')
    Object.assign(module.exports, localConfig)
  } catch (e) {
    // That's fine - no local config exists...
  }
}
