export const resolveContentByRouteId = (collection, routeId) => {
  if (!Array.isArray(collection)) return undefined;
  const byStableId = collection.find((entry) => entry.id === routeId);
  if (byStableId) return byStableId;
  const legacyIndex = Number(routeId);
  return Number.isInteger(legacyIndex) ? collection[legacyIndex] : undefined;
};

export const getContentPosition = (collection, entry) =>
  Math.max(collection.indexOf(entry), 0) + 1;
