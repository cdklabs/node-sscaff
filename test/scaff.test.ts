import { scaff } from '..';
import { promises as fs } from 'fs';
import * as path from 'path';

testWithFixture('fixture2', {
  boom: '_boom_'
});

testWithFixture('fixture3', {
  name: 'oliver'
});

testWithFixture('fixture4');

async function testWithFixture(fixture: string, variables?: { [key: string]: string }) {
  test(fixture, async () => {
    const input = path.join(__dirname, fixture);
    const expected = path.join(__dirname, `${fixture}.expected`);
  
    const actual = await fs.mkdtemp('/tmp/scaff-test');
    const outdir = path.join(actual, 'myproject');
    await scaff(input, outdir, variables);

    try {
      await expectDirsEqual(actual, expected, [ '.hooks.scaff.js' ]);
    } catch (e) {
      console.log(`\nto update:\n  rsync --delete -av ${actual}/ ${expected}/`);
      throw e;
    }
  });
}

async function expectDirsEqual(left: string, right: string, exclude: string[] = []) {
  const leftFiles = (await fs.readdir(left)).sort().filter(x => !exclude.includes(x));
  const rightFiles = (await fs.readdir(right)).sort().filter(x => !exclude.includes(x));
  expect(leftFiles).toEqual(rightFiles);

  for (const file of leftFiles) {
    const leftFile = path.join(left, file);
    const rightFile = path.join(right, file);

    const leftIsDirectory = (await fs.stat(leftFile)).isDirectory();
    const rightIsDirectory = (await fs.stat(rightFile)).isDirectory();
    expect(leftIsDirectory).toEqual(rightIsDirectory);

    if (leftIsDirectory) {
      await expectDirsEqual(leftFile, rightFile);
      continue;
    }
    
    const leftContents = await fs.readFile(leftFile, 'utf-8');
    const rightContents = await fs.readFile(rightFile, 'utf-8');
    expect(leftContents).toEqual(rightContents);
  }
}