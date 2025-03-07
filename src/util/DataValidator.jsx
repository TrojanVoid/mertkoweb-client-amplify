export const isValidObjectData = (data) => {
  if (!data || typeof data !== "object") {
    return false;
  }
    
  const validate = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (!key || key.trim() === "") {
        return false;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (!item || (typeof item === "string" && item.trim() === "")) {
            return false;
          }
          if (typeof item === "object" && !validate(item)) {
            return false;
          }
        }
      } else if (typeof value === "object" && value !== null) {
        if (!validate(value)) {
          return false;
        }
      } else if (!value || (typeof value === "string" && value.trim() === "")) {
        return false;
      }
    }
    return true;
  };
    
  return validate(data);
} 

export const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return false;
  }

  // Remove spaces and dashes for validation
  const cleanedNumber = phoneNumber.replace(/[-\s]/g, "");

  const phoneRegex = /^(?:\+?\d{1,3})?\s?(?:\(?\d{2,4}\)?)?\d{3,4}\d{2,2}\d{2,2}$/;

  return phoneRegex.test(cleanedNumber);
};

export const TimeFormats = {
  TWELVE_HOUR: "12h",
  TWENTY_FOUR_HOUR: "24h",
};

export const isValidHour = (hour, format) => {
  if (!hour || typeof hour !== "string" || !format) {
    return false;
  }

  // Regular expressions for 12-hour and 24-hour formats
  const twelveHourRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  const twentyFourHourRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  switch (format) {
    case TimeFormats.TWELVE_HOUR:
      return twelveHourRegex.test(hour);
    case TimeFormats.TWENTY_FOUR_HOUR:
      return twentyFourHourRegex.test(hour);
    default:
      return false;
  }
};

