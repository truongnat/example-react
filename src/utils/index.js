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

export const transformResponse = (response) => {
  if (!response.data && response.status !== 200) {
    return null;
  }
  return response.data;
};
