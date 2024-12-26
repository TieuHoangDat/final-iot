import { database, ref, set, onValue } from './firebase';

export const fetchPassword = (callback) => {
  const passwordRef = ref(database, 'PASSWORD');
  onValue(passwordRef, (snapshot) => {
    const password = snapshot.val();
    callback(password);
  });
};

export const savePassword = (newPassword) => {
  const passwordRef = ref(database, 'PASSWORD');
  return set(passwordRef, newPassword);
};
