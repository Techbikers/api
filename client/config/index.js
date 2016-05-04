const configs = {
  global: {
    API_ROOT: "/api"
  },
  production: {
    SEGMENT_TRACKING_KEY: "URQvrM6okB7zRxfTdU6B7apD1Rrl7X5j"
  },
  development: {
    SEGMENT_TRACKING_KEY: "D7XGqhxXUerI0Gmz1sR48pgU5mo0iBIc"
  },
}

const globalConfig = configs.global
const envConfig = configs[process.env.NODE_ENV]

// Copy global and environment config into exports
Object.assign(module.exports, globalConfig, envConfig)

if (process.env.NODE_ENV === "development") {
  // Attempt to load and copy over the local config, if it exists...
  try {
    const localConfig = require("./local")
    Object.assign(module.exports, localConfig)
  } catch (e) {
    // That's fine - no local config exists...
  }
}
