export function getRandomExperiment() {
    const experiments = ['exp1.html', 'exp2.html', 'exp3.html', 'exp4.html'];
    return experiments[Math.floor(Math.random() * experiments.length)];
  }
  