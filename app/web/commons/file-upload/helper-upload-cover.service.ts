import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../../shared/config/configuration.service';

@Injectable()
export class HelperUploadCoverService {

    constructor() {
        this.filterFile = this.filterFile.bind(this); // called from an external source
    }

    public filterFile(file: File): Promise<File> {
        if (file.type.indexOf('image') === 0) {
            // scaling down is a destructive operation, so we want to reassign some important properties
            let propertiesToKeep = [];

            return this.filterScaleDownToJPEG(file, propertiesToKeep);
        } else {
            return Promise.resolve(file);
        }
    }

    static dataStringToFile(dataString: string, filename: string, mimeType: string): File {
        const binaryString = atob(dataString);

        let binaryStringLength = binaryString.length;
        let u8Array = new Uint8Array(binaryStringLength);

        while (binaryStringLength--) {
          u8Array[binaryStringLength] = binaryString.charCodeAt(binaryStringLength);
        }

        return new File([u8Array], filename, { type: mimeType });
    }

    private filterScaleDownToJPEG(file: File, propertiesToKeep: any[]): Promise<File> {
        return this.getImageDimensions(file)
            .then((imageElement) => {
                let newFile = this.resizeImage(file, imageElement);
                propertiesToKeep.forEach((p) => {
                    newFile[p.key] = p.value;
                });
                return newFile;
            });
    }

    private resizeImage(file: File, imageElement: HTMLImageElement): File {
        const width = imageElement.width;
        const height = imageElement.height;
        let newWidth = ConfigurationService.maxShardWidth;
        let newHeight = ConfigurationService.maxShardHeight;

        if (this.needsScalingDown(width, height) === false) {
            newWidth = width;
            newHeight = height;
        } else {
            if (this.isPortrait(width, height) === true) {
                newWidth = width * newHeight / height;
            } else if (this.isLandscape(width, height) === true) {
                newHeight = height * newWidth / width;
            } // else is a square and we are already done
        }

        let canvasElement = document.createElement('canvas');
        canvasElement.width = newWidth;
        canvasElement.height = newHeight;

        canvasElement.getContext('2d').drawImage(imageElement, 0, 0, newWidth, newHeight);
        const dataURL = canvasElement.toDataURL('image/jpeg');
        canvasElement.remove();

        return this.dataURLToFile(dataURL, file.name);
    }

    private dataURLToFile (dataURL: string, filename: string): File {
      const dataURLArray = dataURL.split(',');
      const mimeType = dataURLArray[0].match(/:(.*?);/)[1];

      return HelperUploadCoverService.dataStringToFile(dataURLArray[1], filename, mimeType);
    };

    private isPortrait(width, height) {
        return width < height;
    }

    private isLandscape(width, height) {
        return width > height;
    }

    private needsScalingDown(width: number, height: number): boolean {
        return width > ConfigurationService.maxShardWidth
               || height > ConfigurationService.maxShardHeight;
    }

    private getImageDimensions(imageFile: File): Promise<HTMLImageElement> {
        let tempImg = document.createElement('img');

        tempImg.setAttribute('src', URL.createObjectURL(imageFile));

        return new Promise((resolve, reject) => {
            tempImg.addEventListener('load', () => {
                URL.revokeObjectURL(tempImg.getAttribute('src'));
                resolve(tempImg);
            });

            tempImg.addEventListener('error', (error) => {
                tempImg.remove();
                reject(error);
            });
        });
    }
}
