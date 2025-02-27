const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssPrefixwrap = require('postcss-prefixwrap');

module.exports = ({ file }) => {
  if (!file) return { plugins: [tailwindcss, autoprefixer] }; // Ensure file is defined

  // Convert absolute file path to a relative path from project root
  const relativePath = path.relative(process.cwd(), file).replace(/\\/g, '/'); // Normalize slashes

  // check if the file should be blacklisted
  const isBlacklisted = relativePath.startsWith('src/style/') || relativePath === 'src/index.css' || relativePath.startsWith('node_modules/');

  return {
    plugins: [
      tailwindcss,
      autoprefixer,
      ...(!isBlacklisted ? [postcssPrefixwrap('.panel-wrapper')] : []), // Apply prefix only if current file is not blacklisted
    ],
  };
};
