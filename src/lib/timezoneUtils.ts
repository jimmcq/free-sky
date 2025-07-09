/**
 * Utility functions for timezone handling
 */

/**
 * Attempts to determine the timezone from coordinates using various methods
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Timezone identifier (e.g., 'America/New_York') or 'UTC' as fallback
 */
export function getTimezoneFromCoordinates(latitude: number, longitude: number): string {
    // Since we don't have access to external timezone APIs in this implementation,
    // we'll use a simplified approach based on longitude offset
    // This is not perfect but provides a reasonable approximation

    // Calculate approximate timezone offset from longitude
    // Each 15 degrees of longitude roughly equals 1 hour of timezone offset
    const hourOffset = Math.round(longitude / 15)

    // Map common timezone offsets to actual timezone identifiers
    const timezoneMap: { [key: string]: string } = {
        '-12': 'Pacific/Kwajalein',
        '-11': 'Pacific/Midway',
        '-10': 'Pacific/Honolulu',
        '-9': 'America/Anchorage',
        '-8': 'America/Los_Angeles',
        '-7': 'America/Denver',
        '-6': 'America/Chicago',
        '-5': 'America/New_York',
        '-4': 'America/Halifax',
        '-3': 'America/Sao_Paulo',
        '-2': 'Atlantic/South_Georgia',
        '-1': 'Atlantic/Azores',
        '0': 'Europe/London',
        '1': 'Europe/Berlin',
        '2': 'Europe/Athens',
        '3': 'Europe/Moscow',
        '4': 'Asia/Dubai',
        '5': 'Asia/Karachi',
        '6': 'Asia/Dhaka',
        '7': 'Asia/Bangkok',
        '8': 'Asia/Shanghai',
        '9': 'Asia/Tokyo',
        '10': 'Australia/Sydney',
        '11': 'Pacific/Noumea',
        '12': 'Pacific/Auckland',
    }

    // Get timezone from map, with fallback to UTC
    const timezone = timezoneMap[hourOffset.toString()] || 'UTC'

    // Validate that the timezone is supported
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone })
        return timezone
    } catch (_e) {
        console.warn(`Invalid timezone "${timezone}" for coordinates (${latitude}, ${longitude}), falling back to UTC`)
        return 'UTC'
    }
}

/**
 * Validates a timezone identifier
 * @param timezone - Timezone identifier to validate
 * @returns True if valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone })
        return true
    } catch (_e) {
        return false
    }
}

/**
 * Gets a safe timezone identifier with fallback
 * @param timezone - Timezone identifier to validate
 * @param fallback - Fallback timezone (defaults to 'UTC')
 * @returns Valid timezone identifier
 */
export function getSafeTimezone(timezone: string, fallback: string = 'UTC'): string {
    if (isValidTimezone(timezone)) {
        return timezone
    }

    if (isValidTimezone(fallback)) {
        return fallback
    }

    return 'UTC'
}
