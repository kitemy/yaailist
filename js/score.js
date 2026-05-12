function score(rank, percent, minPercent) {
    if (rank > 150) return 0;
    if (rank > 75 && percent < 100) return 0;

    let s = (-25 * Math.pow(rank - 1, 0.4) + 200) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    s = Math.max(0, s);

    if (percent !== 100) s -= s / 3;

    return Math.max(Math.round(s), 0);
}
