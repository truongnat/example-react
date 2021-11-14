import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {storage} from '../config/firebase-cloud';

export const fakeAuth = {
  isAuthenticated: false,
  signIn(cb) {
    setTimeout(cb, 1000);
  },
  signOut(cb) {
    setTimeout(cb, 1000);
  },
};

export const MemoryClient = {
  set(key, val) {
    localStorage.setItem(key, val);
  },
  get(key) {
    return localStorage.getItem(key);
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  removeMultiple(keys) {
    for (const key of keys) localStorage.removeItem(key)
  }
};

export const CookieClient = {
  get(key) {
    const cookieStorage = document.cookie;
    if (!cookieStorage || !key) {
      return null;
    }

    const listCookie = cookieStorage.split(";").map((c) => {
      const data = c.split("=");
      return {
        key: data[0].trim().toLocaleLowerCase(),
        value: data[1].trim().toLocaleLowerCase(),
      };
    });
    const cookieExists = listCookie.find(
      (c) => c.key === key.toLocaleLowerCase()
    );
    if (!cookieExists) {
      return null;
    }
    return cookieExists.value;
  },
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error)
  })
}

export const uploadFileFirebase = async (userId, file) => {
  try {
    let pathFile = `/public/${userId}/${file.name}`;
    const storageRef = ref(storage, pathFile);
    const responseUpload = await uploadBytes(storageRef, file);
    if (responseUpload.metadata) {
      return await getDownloadURL(storageRef).catch((e) => {
        console.log('error downloading link : ', e);
        return '';
      });
    }
  } catch (e) {
    console.log('useUploadSingleFile error : ', e);
    return null;
  }
}