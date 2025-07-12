export const displayCountDownDate = (d: number, h: number, m: number, s: number) => {
    return `${d} days ${h < 10 ? '0'+ h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}