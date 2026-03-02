export const formatDiscipline = (points: number): string => {
    if (points >= 1000000) {
        return (points / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (points >= 1000) {
        return (points / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return points.toString();
};
