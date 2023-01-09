class InteractionError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DiscordUserStatsAlreadyBound extends InteractionError {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

class OriginStatsAlreadyBound extends InteractionError {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

class UserNotBound extends InteractionError {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

class NoPermission extends InteractionError {
  constructor(message, options) {
    super(message);
    this.options = options;
  }
}

module.exports = {
  InteractionError,
  DiscordUserStatsAlreadyBound,
  OriginStatsAlreadyBound,
  UserNotBound,
  NoPermission,
};
