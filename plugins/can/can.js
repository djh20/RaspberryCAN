const socketcan = require('socketcan');

class CanPlugin {
  register(plugin) {
    this.plugin = plugin;
    this.interface = plugin.config.interface;
    this.definition = plugin.config.definition;

    if (!this.interface) return plugin.logger.error('No interface defined in plugin configuration.');
    if (!this.definition) return plugin.logger.error('No definition defined in plugin configuration.');
  }
}

module.exports = new CanPlugin();