export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }
    if (rank > 75 && percent < 100) {
        return 0;
    }
    let score = (-25 * Math.pow(rank - 1, 0.4) + 200) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));
    score = Math.max(0, score);
    if (percent != 100) {
        return Math.round(score - score / 3);
    }
    return Math.max(Math.round(score), 0);
}
