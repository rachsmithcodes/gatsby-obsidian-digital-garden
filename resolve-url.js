const slugify = require('slugify');
module.exports = (title) => {
  console.log(title);
  return `/${slugify(title, { lower: true })}`;
};
