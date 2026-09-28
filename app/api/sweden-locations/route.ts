import { NextRequest, NextResponse } from "next/server";
import { isSwedenCoordinate, SWEDEN_BOUNDS, SWEDEN_COUNTRY } from "@/lib/firebase/profileLimits";

type PhotonFeature = {
  geometry?: { coordinates?: number[] };
  properties?: {
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    town?: string;
    locality?: string;
    district?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    postcode?: string;
  };
};

function uniqueParts(parts: string[]) {
  const seen = new Set<string>();
  return parts.filter((part) => {
    const key = part.toLowerCase();
    if (!part || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("lat", "59.33");
  url.searchParams.set("lon", "18.07");
  url.searchParams.set("limit", "12");
  url.searchParams.set("lang", "en");
  url.searchParams.set(
    "bbox",
    `${SWEDEN_BOUNDS.minLng},${SWEDEN_BOUNDS.minLat},${SWEDEN_BOUNDS.maxLng},${SWEDEN_BOUNDS.maxLat}`
  );

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "SpectRoom-Web/1.0 (spectroom.support@gmail.com)",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return NextResponse.json([]);
  }

  const payload = (await response.json()) as { features?: PhotonFeature[] };
  const mapped = (payload.features ?? [])
    .map((feature) => {
      const [longitude, latitude] = feature.geometry?.coordinates ?? [];
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
      if (!isSwedenCoordinate(latitude, longitude)) return null;

      const properties = feature.properties ?? {};
      const countryCode = properties.countrycode?.toUpperCase();
      if (countryCode && countryCode !== "SE") return null;

      const city =
        properties.city ||
        properties.town ||
        properties.locality ||
        properties.district ||
        "";
      const title = properties.housenumber && properties.street
        ? `${properties.street} ${properties.housenumber}`
        : properties.name || properties.street || city;
      if (!title) return null;

      const subtitle = uniqueParts(
        [
          properties.district && properties.district !== title ? properties.district : "",
          city && city !== title ? city : "",
          properties.county || properties.state || "",
          properties.country || SWEDEN_COUNTRY,
        ].filter((part) => part && part !== title)
      ).join(", ");

      const displayString = subtitle ? `${title}, ${subtitle}` : title;
      return {
        title,
        subtitle,
        displayString,
        city,
        state: properties.county || properties.state || "",
        country: SWEDEN_COUNTRY,
        latitude,
        longitude,
      };
    })
    .filter(Boolean);

  const deduped = mapped.filter(
    (item, index, all) =>
      all.findIndex(
        (other) =>
          other &&
          item &&
          other.displayString === item.displayString
      ) === index
  );

  return NextResponse.json(deduped.slice(0, 8));
}
