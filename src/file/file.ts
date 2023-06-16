import path from 'path';
import { promises as fsPromises } from 'fs';

const imagesPath = path.resolve(__dirname, '../../assets/full');

const getImageNameList = async (): Promise<string[]> => {
  const files = await fsPromises.readdir(imagesPath).catch(() => []);
  return files.map((file) => path.parse(file).name);
};

export default getImageNameList;
