export function firstOrDefault<T>(array: T[] | null | undefined): T | null {
    if (array && array.length > 0) {
        return array[0];
    }
    return null;
}