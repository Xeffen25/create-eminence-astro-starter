import type { ProjectInput } from '../../../../types.js';

export const path = 'src/tests/example.test.ts';

export function generate(input: ProjectInput): string | undefined {
  if (!input.improvements.vitest) return;
  return `// import ComponentName from "@/components/ComponentName.astro";
import { describe, expect, it } from "vitest";

describe("Example test suite", () => {
  it("Example test case", async () => {
    /* const container = await experimental_AstroContainer.create();
		const result = await container.renderToString(Card, {
			slots: {
				default: "Card content",
			},
		}); */

    expect("").toBe("");
  });
});
`;
}
