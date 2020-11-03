import { Filesystem } from "../api/filesystem";

export class LocalFilesystem extends Filesystem {
  constructor() {
    super();
    throw new Error('LocalFilesystem is not supported in the browser.')
  }

  tryList(path: string): string[] {
    throw new Error('LocalFilesystem is not supported in the browser.')
  }

  tryRead(filename: string): Buffer {
    throw new Error('LocalFilesystem is not supported in the browser.')
  }
}