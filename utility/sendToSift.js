import axios from "axios";

export const sendImageToSift = async (images, idProduct) => {
  try {

    const form = []
    images.forEach((image) => {
      form.push(image.buffer.toString('base64'));
    });

    
    const response = await axios.post("http://127.0.0.1:8000/upload-files/product-box-images", {images: form, idProduct: idProduct});
    console.log(response.data.result.data)
    return response.data.result;

  } catch (err) {
    console.error(err);
    throw new Error("error from sendImageToSift");
  }
};