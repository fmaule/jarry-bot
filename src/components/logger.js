const initLogger = (name) => {
  return {
    log: (...params) => console.log(`[${name}]`, ...params),
    logError: (...params) => console.error(`[${name}]`, ...params)
  }
}

module.exports = {
  initLogger,
};
