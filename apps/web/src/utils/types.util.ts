export interface Page<T> {
    items: T[],
    totalPages: number,
    count: number
}