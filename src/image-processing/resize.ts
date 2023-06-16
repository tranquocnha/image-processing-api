import path from 'path';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';

export interface imageResizing {
  filename: string;
  width: number;
  height: number;
}

const fullFolder = path.resolve(__dirname, '../../assets/full');
const thumbnailFolder = path.resolve(__dirname, '../../assets/thumbnail');

const resizeImage = async ({
  filename,
  width,
  height,
}: imageResizing): Promise<Buffer> => {
  const inputFilePath = path.join(fullFolder, `${filename}.jpg`);
  return await sharp(inputFilePath).resize(width, height).toBuffer();
};

const getExistResizedImagePath = ({
  filename,
  width,
  height,
}: imageResizing): string => {
  const outputFileName = `${filename}-${width}x${height}.jpg`;
  return path.join(thumbnailFolder, outputFileName);
};

const checkFileExist = async (params: imageResizing): Promise<boolean> => {
  const filePath = getExistResizedImagePath(params);
  try {
    await fsPromises.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

export default { resizeImage, getExistResizedImagePath, checkFileExist };
