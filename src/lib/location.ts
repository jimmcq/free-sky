// Web-based geolocation utilities to replace expo-location

export interface LocationResult {
    coords: {
        latitude: number
        longitude: number
    }
}

export async function requestLocationPermission(): Promise<PermissionState> {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
    }

    if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        return permission.state
    }

    // Fallback for browsers without permission API
    return 'granted'
}

export async function getCurrentPosition(): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                })
            },
            error => {
                reject(error)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        )
    })
}
