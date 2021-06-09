const { TypeScriptProject } = require('projen');

const project = new TypeScriptProject({
  name: 'sscaff',
  description: 'Stupid scaffoling: create a copy of a directory with variable substitution',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'elad.benisrael@gmail.com',
  repository: 'https://github.com/cdklabs/node-sscaff',
  releaseToNpm: true,
  defaultReleaseBranch: 'master',
  srcdir: 'lib',
  testdir: 'lib/__tests__',
});

project.synth();
