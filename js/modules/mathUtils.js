export function getRandomExperiment() {
  const experiments = [
    'experiment1.html',
    'experiment2.html',
    'experiment3.html',
    'experiment4.html'
  ];
  return experiments[Math.floor(Math.random() * experiments.length)];
}
