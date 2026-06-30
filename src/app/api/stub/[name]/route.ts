import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const VALID_STUBS = [
  "account",
  "activity",
  "addons",
  "billing",
  "tickets",
  "usage-history",
  "usage",
] as const;

type StubName = (typeof VALID_STUBS)[number];

function isValidStub(name: string): name is StubName {
  return (VALID_STUBS as readonly string[]).includes(name);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { name: string } }
) {
  const { name } = params;

  if (!isValidStub(name)) {
    return NextResponse.json(
      { error: `Unknown stub: ${name}. Valid stubs: ${VALID_STUBS.join(", ")}` },
      { status: 404 }
    );
  }

  try {
    const filePath = join(process.cwd(), "stubs", `${name}.json`);
    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read stub file" }, { status: 500 });
  }
}
