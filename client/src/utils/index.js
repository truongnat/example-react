import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase-cloud";

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
    for (const key of keys) localStorage.removeItem(key);
  },
  clearAll() {
    localStorage.clear();
  },
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

export const uploadFileFirebase = async (userId, file) => {
  try {
    let pathFile = `/public/${userId}/${file.name}`;
    const storageRef = ref(storage, pathFile);
    const responseUpload = await uploadBytes(storageRef, file);
    if (responseUpload.metadata) {
      return await getDownloadURL(storageRef).catch((e) => {
        console.log("error downloading link : ", e);
        return "";
      });
    }
  } catch (e) {
    console.log("useUploadSingleFile error : ", e);
    return null;
  }
};

export function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}
