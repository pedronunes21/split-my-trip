import { cookies } from "next/headers";

export async function getCookies(names: string[]) {
  const c = await cookies();
  const cookieValues = await Promise.all(
    names
      .filter((name) => !!c.get(name)?.value)
      .map((name) => `${name}=${c.get(name)?.value}`)
  );
  return cookieValues.join("; ");
}
