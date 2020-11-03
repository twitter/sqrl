import { join, resolve } from "path";
import { readFileSync, readdirSync } from "fs";
import { Filesystem } from "../api/filesystem";

export class LocalFilesystem extends Filesystem {
  constructor(private pwd: string) {
    super();
  }

  tryList(path: string) {
    try {
      return readdirSync(join(this.pwd, path)).filter(filename =>
        filename.endsWith(".sqrl")
      );
    } catch (err) {
      if (err.code === "ENOENT") {
        return null;
      }
      throw err;
    }
  }

  tryRead(filename: string) {
    const path = resolve(this.pwd, filename);
    return readFileSync(path);
  }
}