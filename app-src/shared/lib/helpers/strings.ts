/**
 * Convert a string to kebab-case
 * @param string - string to convert
 * @returns kebab-case string
 */
export const toKebabCase = (string: string) =>
  string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Convert a string to camelCase
 * @param string - string to convert
 * @returns camelCase string
 */
export const toCamelCase = (string: string) =>
  string.replace(/^([A-Z])|[\s-_]+(\w)/g, (_, p1, p2) => (p2 ? p2.toUpperCase() : p1.toLowerCase()))

/**
 * Convert a string to PascalCase
 * @param string - string to convert
 * @returns PascalCase string
 */
export const toPascalCase = (string: string) => {
  const camelCase = toCamelCase(string)
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
}

interface NormalizeOptions {
  ignoreAccents?: boolean
}

/**
 * Normalizes a string by converting to lowercase, trimming whitespace,
 * and optionally removing accents/diacritics.
 *
 * @param str - The string to normalize
 * @param options - Configuration options
 * @param options.ignoreAccents - Whether to remove accents and diacritics (default: true)
 * @returns The normalized string
 *
 * @example
 * normalize('  Héllo Wörld  ') // 'hello world'
 * normalize('  Héllo Wörld  ', { ignoreAccents: false }) // 'héllo wörld'
 */
export const normalize = (str: string, { ignoreAccents = true }: NormalizeOptions = {}): string => {
  let normalized = str.toLowerCase().trim()

  if (ignoreAccents) {
    normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  return normalized
}

/**
 * Validates if a string is a valid email address.
 * Checks for common edge cases and malformed patterns.
 *
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 *
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('user@.com') // false
 * isValidEmail('user@domain..com') // false
 * isValidEmail('@domain.com') // false
 * isValidEmail('user@domain') // false
 * isValidEmail('user.name+tag@example.co.uk') // true
 */
export const isValidEmail = (email: string) => {
  if (!email || typeof email !== 'string') return false

  const trimmed = email.trim()

  // Length and @ symbol checks
  if (!trimmed || trimmed.length > 254 || (trimmed.match(/@/g) || []).length !== 1) return false

  const [local, domain] = trimmed.split('@')

  // Local part validation
  if (!local || local.length > 64 || local.includes('..') || /^\.|\.$/.test(local)) return false

  // Domain part validation
  if (!domain || domain.length > 253 || domain.includes('..') || !domain.includes('.')) return false

  if (/^[.-]|[.-]$/.test(domain)) return false

  // Domain labels validation
  const labels = domain.split('.')
  const tld = labels[labels.length - 1]

  if (labels.some((label) => !label || /^-|-$/.test(label) || !/^[a-zA-Z0-9-]+$/.test(label))) {
    return false
  }

  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false

  // Final RFC 5322 compliant regex validation
  const regex =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

  return regex.test(trimmed)
}

/**
 * Checks if a string contains at least one uppercase letter
 * @param str - The string to check
 * @returns true if the string contains at least one uppercase letter, false otherwise
 *
 * @example
 * hasUppercase('Hello') // true
 * hasUppercase('hello') // false
 * hasUppercase('HELLO') // true
 */
export const hasUppercase = (str: string): boolean => /[A-Z]/.test(str)

/**
 * Checks if a string contains at least one lowercase letter
 * @param str - The string to check
 * @returns true if the string contains at least one lowercase letter, false otherwise
 *
 * @example
 * hasLowercase('Hello') // true
 * hasLowercase('HELLO') // false
 * hasLowercase('hello') // true
 */
export const hasLowercase = (str: string): boolean => /[a-z]/.test(str)

/**
 * Checks if a string contains at least one number
 * @param str - The string to check
 * @returns true if the string contains at least one number, false otherwise
 *
 * @example
 * hasNumber('Hello123') // true
 * hasNumber('Hello') // false
 * hasNumber('abc1def') // true
 */
export const hasNumber = (str: string): boolean => /[0-9]/.test(str)

/**
 * Checks if a string contains at least one special character
 * @param str - The string to check
 * @returns true if the string contains at least one special character, false otherwise
 *
 * @example
 * hasSpecialCharacter('Hello!') // true
 * hasSpecialCharacter('Hello') // false
 * hasSpecialCharacter('pass@word') // true
 */
export const hasSpecialCharacter = (str: string): boolean => /[!@#$%^&*]/.test(str)

/**
 * Checks if a string is empty (null, undefined, or empty string)
 * @param str - The string to check
 * @returns true if the string is empty, false otherwise
 *
 * @example
 * isEmpty('') // true
 * isEmpty('hello') // false
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 */
export const isEmpty = (str: string | null | undefined): boolean => !str || str.trim().length === 0

/**
 * Checks if a string has a minimum length
 * @param str - The string to check
 * @param minLength - The minimum required length
 * @returns true if the string meets the minimum length, false otherwise
 *
 * @example
 * hasMinLength('hello', 3) // true
 * hasMinLength('hi', 3) // false
 */
export const hasMinLength = (str: string, minLength: number): boolean => str.length >= minLength

/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 *
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('Hello') // 'Hello'
 * capitalize('h') // 'H'
 * capitalize('') // ''
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
