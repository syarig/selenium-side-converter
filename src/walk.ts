import fs from 'fs';
import {Walker} from 'src/command/walker';
import {promises} from 'fs';
import path from 'path';


export async function walk(dirpath: string, walker: Walker): Promise<void> {
  let entries: Array<fs.Dirent> = [];
  try {
    entries = await walk.promises.readdir(dirpath, {withFileTypes: true});


  } catch (e) {
    walker.catch(e);
    return;
  }

  entries.forEach((dirent: fs.Dirent) => {

    const nextDirpath = path.join(dirpath, dirent.name);
    if (dirent.isDirectory()) {
      walk(nextDirpath, walker);

    } else {
      walker.default(nextDirpath);
    }
  });
}

walk.promises = promises;