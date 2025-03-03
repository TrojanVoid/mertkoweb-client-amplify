class Logger {
  static lastLogType = null;

  static TITLE_TAGS = {
    PRODUCT_API: "PRODUCT API",
    BLOG_API: "BLOG API",
    BANNER_API: "BANNER API",
    ABOUT_API: "ABOUT API",
    AUTH_SERVICE: "AUTH SERVICE",
    UI_COMPONENT: "UI COMPONENT",
    DATABASE: "DATABASE",
  };

  static LOG_TYPES = {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
  };

  static SEPARATORS = {
    DIFFERENT_TAG: "################################################################",
    SAME_TAG:      "----------------------------------------------------------------",
  };

  static getSeparator(currentType) {
    return this.lastLogType === currentType
      ? Logger.SEPARATORS.SAME_TAG
      : Logger.SEPARATORS.DIFFERENT_TAG;
  }

  static log(message, title = "General") {
    this.printLog(message, title, Logger.LOG_TYPES.INFO, "blue");
  }

  static warn(message, title = "General") {
    this.printLog(message, title, Logger.LOG_TYPES.ERROR, "orange");
  }

  static error(message, title = "General") {
    this.printLog(message, title, Logger.LOG_TYPES.ERROR, "red");
  }

  static printLog(message, title, logType, color) {
    console.log(`%c${this.getSeparator(logType)}`, "color: gray;");
    console.log(
      `%c[${logType}] %c(${title}) %c${message}`,
      `color: ${color}; font-weight: bold;`,
      "color: green; font-weight: bold;",
      "color: gray;"
    );
    this.lastLogType = logType;
  }
}

// Export title tags for easy use
export const TITLE_TAGS = Logger.TITLE_TAGS;
export { Logger };
