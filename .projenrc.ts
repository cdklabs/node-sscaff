import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  name: 'sscaff',
  projenrcTs: true,
  description: 'Stupid scaffoling: create a copy of a directory with variable substitution',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'elad.benisrael@gmail.com',
  repository: 'https://github.com/cdklabs/node-sscaff',
  releaseToNpm: true,
  defaultReleaseBranch: 'main',
  srcdir: 'lib',
  testdir: 'lib/__tests__',
  minNodeVersion: '14.17.0',
  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
});

project.gitignore.include('lib/__tests__/**/.hooks.sscaff.js');
project.synth();
