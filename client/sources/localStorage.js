import Marty, { LocalStorageStateSource } from 'marty';

class LocalStorage extends LocalStorageStateSource {
  setToken(token) {
    this.set('token', token);
  }

  getToken() {
    return this.get('token');
  }

  clearToken() {
    this.clear('token');
  }

  clear(key) {
    this.storage.clear(key);
  }
}

export default LocalStorage;