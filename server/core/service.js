const ConsoleLogger = require("./consoleLogger");

/**
 * @Service
 * If subclass initial constructor, you must be using super();
 *
 * Logger loader and defined property, static method ...
 * */
class Service {
  constructor() {
    ConsoleLogger.warn(`Instance Service ${this.constructor.name} has loaded!`);
  }

  // implement static method for service
}

module.exports = Service;
