export type LocationSuggestion = {
  title: string;
  subtitle: string;
  displayString: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
};

export async function searchSwedenLocations(query: string) {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const response = await fetch(
    `/api/sweden-locations?q=${encodeURIComponent(trimmed)}`
  );
  if (!response.ok) return [];
  return (await response.json()) as LocationSuggestion[];
}
