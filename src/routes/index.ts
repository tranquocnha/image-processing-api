import express from 'express';
import resize, { imageResizing } from '../image-processing/resize';
import getImageNameList from '../file/file';
import path from 'path';
import { promises as fsPromises } from 'fs';

const routes = express.Router();

const validate = async ({ filename, width, height }: imageResizing): Promise<string | null> => {
  const parsedWidth = parseInt(String(width));
  const parsedHeight = parseInt(String(height));

  if (!filename) {
    const imageNameList = (await getImageNameList()).join(', ');
    return `Here is a list of file names that you can use: ${imageNameList}.`;
  }
  if (!width || !height) {
    return "Please insert both 'width' and 'height' to resize the image.";
  }
  if (Number.isNaN(parsedWidth) || parsedWidth < 1) {
    return "Please insert a positive number for 'width'.";
  }
  if (Number.isNaN(parsedHeight) || parsedHeight < 1) {
    return "Please insert a positive number for 'height'.";
  }

  return null;
};

routes.get('/', async (req, res) => {
  try {
    const params: imageResizing = {
      filename: req.query.filename as string,
      width: parseInt(req.query.width as string),
      height: parseInt(req.query.height as string),
    };
    const validationMessage: string | null = await validate(params);
    const isFileExist: boolean = await resize.checkFileExist(params);

    if (validationMessage) {
      res.send(validationMessage);
      return;
    }

    if (!isFileExist) {
      const resizedImage = await resize.resizeImage(params);
      const outputPath = resize.getExistResizedImagePath(params);
      await fsPromises.writeFile(outputPath, resizedImage);
      res.sendFile(path.resolve(outputPath));
    } else {
      const existResizedImagePath: string =
        await resize.getExistResizedImagePath(params);
      res.sendFile(path.resolve(existResizedImagePath));
    }
  } catch (error) {
    res.json({ message: (error as Error).message });
  }
});

routes.use('/images', routes);

export default routes;