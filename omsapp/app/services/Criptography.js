import CryptoJS from 'react-native-crypto-js';

export const decryptData = (cipherText, key = "0123456789ABCDEF0123456789ABCDEF", iv = "0123456789ABCDEF") => {
  try {
    const keyBytes = CryptoJS.enc.Utf8.parse(key);
    const ivBytes = CryptoJS.enc.Utf8.parse(iv);

    const decryptedBytes = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherText),
      },
      keyBytes,
      { iv: ivBytes }
    );

    const decryptedText = CryptoJS.enc.Utf8.stringify(decryptedBytes);

    return decryptedText;
  } catch (error) {
    console.error('Error al desencriptar los datos:', error);
    return null;
  }
};

export const encryptData = (plainText, key = "0123456789ABCDEF0123456789ABCDEF", iv = "0123456789ABCDEF") => {
    try {
        const plainTextString = plainText.toString();


      const keyBytes = CryptoJS.enc.Utf8.parse(key);
      const ivBytes = CryptoJS.enc.Utf8.parse(iv);
  
      const encrypted = CryptoJS.AES.encrypt(plainTextString, keyBytes, { iv: ivBytes });
  
      // El resultado se convierte a Base64 antes de ser devuelto
      return encrypted.toString();
    } catch (error) {
      console.error('Error al cifrar los datos:', error);
      return null;
    }
  };