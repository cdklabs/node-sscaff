const fs = require('fs').promises;

exports.pre = variables => {
  variables.orig = variables.name;
  variables.name = variables.name[0].toUpperCase() + variables.name.slice(1);
};

exports.post = async (variables) => {
  await fs.writeFile(variables.orig + '.bak', 'hello hello');
};
