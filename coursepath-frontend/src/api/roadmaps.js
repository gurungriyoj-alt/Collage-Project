import api from "./axios";

// GET /api/roadmaps  — optional { category, search }
export async function fetchRoadmaps(params = {}) {
  const { data } = await api.get("/roadmaps", { params });
  return data;
}

// GET /api/roadmaps/:slug
export async function fetchRoadmap(slug) {
  const { data } = await api.get(`/roadmaps/${slug}`);
  return data;
}

// GET /api/progress/:slug  — requires login, returns { completedStepIds }
export async function fetchProgress(slug) {
  const { data } = await api.get(`/progress/${slug}`);
  return data.completedStepIds;
}

// PUT /api/progress/:slug/steps/:stepId  — toggles one step, returns updated list
export async function toggleStepProgress(slug, stepId) {
  const { data } = await api.put(`/progress/${slug}/steps/${stepId}`);
  return data.completedStepIds;
}