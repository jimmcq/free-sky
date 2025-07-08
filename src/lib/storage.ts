// Web-based storage utilities to replace @react-native-async-storage/async-storage

export class WebStorage {
    static async getItem(key: string): Promise<string | null> {
        try {
            return localStorage.getItem(key)
        } catch (_e) {
            // Error getting item from storage
            return null
        }
    }

    static async setItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value)
    }

    static async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key)
    }

    static async clear(): Promise<void> {
        localStorage.clear()
    }

    static async getAllKeys(): Promise<readonly string[]> {
        try {
            return Object.keys(localStorage)
        } catch (_e) {
            // Error getting all keys from storage
            return []
        }
    }
}
