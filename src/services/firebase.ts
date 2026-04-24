// Firebase storage has been removed. 
// This file is kept as a shell to prevent import errors if any system files reference it.
export const auth = { onAuthStateChanged: () => () => {}, signOut: () => Promise.resolve() } as any;
export const db = {} as any;
export const loginWithGoogle = () => Promise.resolve();
export const updateUserProgress = () => Promise.resolve();
export const saveQuizProgress = () => Promise.resolve();
export const getActivityLogs = () => Promise.resolve([]);
