/**
 * Logger class for logging messages with different severity levels (INFO, WARNING, ERROR).
 * This class handles logging messages to the console with customizable formatting, 
 * support for development mode only logging, and title tagging.
 */
class Logger {
  // Last log type to determine whether the separator should be the same or different.
  static lastLogType = null;

  // Determines if the environment is 'development' mode for logging purposes.
  static devMode = process.env.NODE_ENV === "development";

  // Predefined title tags for different API or service types.
  static TITLE_TAGS = {
    PRODUCT_API: "PRODUCT API",
    BLOG_API: "BLOG API",
    BANNER_API: "BANNER API",
    ABOUT_API: "ABOUT API",
    CONTACT_API: "CONTACT API",
    SLIDER_API: "SLIDER API",
    META_API: "META API",
    AUTH_SERVICE: "AUTH SERVICE",
    UI_COMPONENT: "UI COMPONENT",
    DATABASE: "DATABASE",
  };

  // Log levels or types.
  static LOG_TYPES = {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
  };

  // Separator symbols used between log entries based on log type.
  static SEPARATORS = {
    DIFFERENT_TAG: "################################################################",
    SAME_TAG:      "----------------------------------------------------------------",
  };

  /**
   * Returns a separator string based on the last log type and current log type.
   * 
   * @param {string} currentType - The current log type (INFO, WARNING, ERROR).
   * @returns {string} A separator string.
   */
  static getSeparator(currentType) {
    return this.lastLogType === currentType
      ? Logger.SEPARATORS.SAME_TAG
      : Logger.SEPARATORS.DIFFERENT_TAG;
  }

  /**
   * Logs an informational message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {string} [title="General"] - The title/tag to associate with the log.
   * @param {boolean} [onlyDev=true] - If true, only logs in development mode.
   */
  static info(message, title = "General", onlyDev = true) {
    if (!this.devMode && onlyDev) return;
    this.printLog(message, title, Logger.LOG_TYPES.INFO, "blue");
  }

  /**
   * Logs a warning message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {string} [title="General"] - The title/tag to associate with the log.
   * @param {boolean} [onlyDev=true] - If true, only logs in development mode.
   */
  static warn(message, title = "General", onlyDev = true) {
    if (!this.devMode && onlyDev) return;
    this.printLog(message, title, Logger.LOG_TYPES.WARNING, "orange");
  }

  /**
   * Logs an error message to the console.
   * 
   * @param {string} message - The message to log.
   * @param {string} [title="General"] - The title/tag to associate with the log.
   * @param {boolean} [onlyDev=true] - If true, only logs in development mode.
   */
  static error(message, title = "General", onlyDev = true) {
    if (!this.devMode && onlyDev) return;
    this.printLog(message, title, Logger.LOG_TYPES.ERROR, "red");
  }

  /**
   * Prints a formatted log message to the console with a separator, title, log type, and color.
   * 
   * @param {string} message - The message to log.
   * @param {string} title - The title/tag to associate with the log.
   * @param {string} logType - The log type (INFO, WARNING, ERROR).
   * @param {string} color - The color to apply to the log type.
   */
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
