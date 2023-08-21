import { promises as fs } from 'fs';
import * as path from 'path';
import { sscaff } from '..';

void testWithFixture('fixture1', {
  sscaff: 'here',
  here: 'sscaff',
});

void testWithFixture('fixture2', {
  boom: '_boom_',
});

void testWithFixture('fixture3', {
  name: 'oliver',
});

void testWithFixture('fixture4');

void testWithFixture('fixture5', { name: 'foo' }, 'empty-dir');

async function testWithFixture(fixture: string, variables?: { [key: string]: string }, emptyDirName?: string) {
  test(fixture, async () => {
    const input = path.join(__dirname, fixture);
    const expected = path.join(__dirname, `${fixture}.expected`);

    const [imputEmptyDirPath, expectedEmptyDirPath] = emptyDirName ?
      await createEmptyDirsForTesting(input, expected, emptyDirName): [undefined, undefined];

    const actual = await fs.mkdtemp('/tmp/sscaff-test');
    const outdir = path.join(actual, 'myproject');

    await sscaff(input, outdir, variables);

    try {
      await expectDirsEqual(actual, expected, ['.hooks.sscaff.js']);
    } catch (e) {
      console.log(`\nto update:\n  rsync --delete -av ${actual}/ ${expected}/`);
      throw e;
    } finally {
      // Cleaning up empty dirs created for test, if any
      if (imputEmptyDirPath && expectedEmptyDirPath) {
        await fs.rmdir(imputEmptyDirPath, { recursive: true });
        await fs.rmdir(expectedEmptyDirPath, { recursive: true });
      }
    }
  });
}

async function createEmptyDirsForTesting(input: string, expected: string, emptyDirName: string) {
  // For testing an empty directory. We create this during the test to
  // avoid using .gitkeep files to retain the folder structure in git
  let imputEmptyDirPath;
  let expectedEmptyDirPath;

  if (emptyDirName) {
    imputEmptyDirPath = await fs.mkdir(path.join(input, emptyDirName), { recursive: true });
    expectedEmptyDirPath = await fs.mkdir(path.join(expected, 'myproject', emptyDirName), { recursive: true });
  }

  return [imputEmptyDirPath, expectedEmptyDirPath];
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