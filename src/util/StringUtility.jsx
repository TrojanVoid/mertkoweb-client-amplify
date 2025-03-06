export const toCamelCase = (string) => {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}