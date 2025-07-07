type StorageType = 'local' | 'session';

const STORAGE_MAP = {
    local: localStorage,
    session: sessionStorage,
};

export const setTokens = ({token}: { token: string;
}) => {
    const storage = STORAGE_MAP.local;
    storage.setItem('token', token);
};

export const getToken = (
    key: 'token'
): string | null => {
    return STORAGE_MAP.session.getItem(key) ?? STORAGE_MAP.local.getItem(key);
};

export const clearTokens = () => {
    (['local', 'session'] as StorageType[]).forEach((type) => {
        const storage = STORAGE_MAP[type];
        storage.removeItem('token');
    });
};

export const removeToken = (key: 'token' ) => {
    (['local', 'session'] as StorageType[]).forEach((type) => {
        STORAGE_MAP[type].removeItem(key);
    });
};
