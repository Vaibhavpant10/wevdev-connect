type ActivityMetrics = {
  aiChats: number;
  roadmaps: number;
};

const activityKey = 'devconnect-activity';

export function getActivityMetrics(): ActivityMetrics {
  try {
    const raw = localStorage.getItem(activityKey);
    return raw ? { aiChats: 0, roadmaps: 0, ...JSON.parse(raw) } : { aiChats: 0, roadmaps: 0 };
  } catch {
    return { aiChats: 0, roadmaps: 0 };
  }
}

export function incrementActivityMetric(metric: keyof ActivityMetrics) {
  const current = getActivityMetrics();
  const next = { ...current, [metric]: current[metric] + 1 };
  localStorage.setItem(activityKey, JSON.stringify(next));
  return next;
}
