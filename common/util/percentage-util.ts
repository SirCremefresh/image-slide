export function toPercentage(full: number, part: number): number {
    return (100 / full) * part;
}

export function fromPercentage(full: number, part: number): number {
    return (full / 100) * part;
}
