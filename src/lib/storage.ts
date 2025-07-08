// Web-based storage utilities to replace @react-native-async-storage/async-storage

export class WebStorage {
    static async getItem(key: string): Promise<string | null> {
        try {
            return localStorage.getItem(key)
        } catch (error) {
            console.error('Error getting item from storage:', error)
            return null
        }
    }

    static async setItem(key: string, value: string): Promise<void> {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.error('Error setting item in storage:', error)
            throw error
        }
    }

    static async removeItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Error removing item from storage:', error)
            throw error
        }
    }

    static async clear(): Promise<void> {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Error clearing storage:', error)
            throw error
        }
    }

    static async getAllKeys(): Promise<readonly string[]> {
        try {
            return Object.keys(localStorage)
        } catch (error) {
            console.error('Error getting all keys from storage:', error)
            return []
        }
    }
}
