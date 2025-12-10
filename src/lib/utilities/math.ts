export function clamp(min: number, target: number, max: number): number {
    return Math.max(min, Math.min(target, max))
}

export function ratio(q1: number, d1: number, q2: number): number {
    return (q2 * d1) / q1
}
