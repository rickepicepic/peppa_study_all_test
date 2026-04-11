export function calculateFoodScore(baseScore, doubleActive) {
  return doubleActive ? baseScore * 2 : baseScore;
}
