const cookieName = "campusTourProgress";

export function readDiscoveredLocationIds(
  cookieString: string,
  validIds: ReadonlySet<string>,
): string[] {
  const value = cookieString
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);

  if (value === undefined) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (!Array.isArray(parsed)) {
      return [];
    }

    const discoveredIds = new Set<string>();
    for (const id of parsed) {
      if (typeof id === "string" && validIds.has(id)) {
        discoveredIds.add(id);
      }
    }
    return [...discoveredIds];
  } catch {
    return [];
  }
}

export function createProgressCookie(ids: readonly string[]): string {
  return `${cookieName}=${encodeURIComponent(JSON.stringify(ids))}; Max-Age=34560000; SameSite=Lax; Path=/`;
}
