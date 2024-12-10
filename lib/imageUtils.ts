/** @format */

import { TextSet } from "@/types/textSet";

export const saveCompositeImage = async (
  selectedImage: string,
  removedBgImageUrl: string | null,
  textSets: TextSet[]
): Promise<void> => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
      bgImg.onload = async () => {
        try {
          // Set canvas dimensions
          canvas.width = bgImg.width;
          canvas.height = bgImg.height;

          // Draw background image
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

          // Draw each text element
          textSets.forEach((textSet) => {
            ctx.save();

            // Configure text properties
            ctx.font = `${textSet.fontWeight} ${textSet.fontSize * 3}px ${
              textSet.fontFamily
            }`;
            ctx.fillStyle = textSet.color;
            ctx.globalAlpha = textSet.opacity;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Calculate position
            const x = (canvas.width * (textSet.left + 50)) / 100;
            const y = (canvas.height * (50 - textSet.top)) / 100;

            // Apply transform
            ctx.translate(x, y);
            ctx.rotate((textSet.rotation * Math.PI) / 180);

            // Draw text shadow if specified
            if (textSet.shadowColor && textSet.shadowSize > 0) {
              ctx.shadowColor = textSet.shadowColor;
              ctx.shadowBlur = textSet.shadowSize;
              ctx.shadowOffsetX = textSet.shadowSize / 2;
              ctx.shadowOffsetY = textSet.shadowSize / 2;
            }

            // Draw text
            ctx.fillText(textSet.text, 0, 0);
            ctx.restore();
          });

          // Handle removed background image if present
          if (removedBgImageUrl) {
            const removedBgImg = new Image();
            removedBgImg.crossOrigin = "anonymous";

            removedBgImg.onload = () => {
              ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
              triggerDownload(canvas);
              resolve();
            };

            removedBgImg.onerror = () => {
              reject(new Error("Failed to load removed background image"));
            };

            removedBgImg.src = removedBgImageUrl;
          } else {
            triggerDownload(canvas);
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      };

      bgImg.onerror = () => {
        reject(new Error("Failed to load background image"));
      };

      bgImg.src = selectedImage;
    });
  } catch (error) {
    console.error("Error in saveCompositeImage:", error);
    throw error;
  }
};

const triggerDownload = (canvas: HTMLCanvasElement): void => {
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `text-behind-image-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error triggering download:", error);
    throw new Error("Failed to download image");
  }
};
