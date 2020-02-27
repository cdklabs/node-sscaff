const fs = require('fs').promises;

exports.pre = vars => {
  // you can add variables dynamically in the "pre" hook
  vars.ext = `ext-${vars.$base}-${vars.boom}`;
};

// can be either sync or async
exports.post = async variables => {
  console.log(`created in ${process.cwd()}`);
  await fs.writeFile('dynamic.txt', JSON.stringify(variables, undefined, 2));
};
