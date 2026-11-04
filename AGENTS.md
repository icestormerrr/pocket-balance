# Agent Instructions

## Before You Start

- Use the `grilling` skill to clarify the task whenever its requirements, scope, or intended behavior are unclear.
- Write code according to the project's architecture. See docs/architecture.md.
- Cover every change according to the project's test model. See docs/testing.md.

## After work

- Run the following checks for the affected functionality:
  - Type check: `npx tsc -b`.
  - Lint checks: `npm run eslint`.
  - Run relevant tests: `npm run test:unit -- <test-file>`
- Fix only issues caused by, or located within, the affected functionality. Do not fix unrelated existing type, lint, or test failures; report them to the user instead.
- Offer to user write/change doc/skill for better generation next time (only if you learned useful rule)

## Main recommendations

- Design public function interfaces to be clean and self-explanatory: their signatures should make the function's purpose and required data clear. If a signature has too many parameters, reconsider the abstraction or group related parameters into an object.
- Prefer good composition: split large code blocks into small, meaningful parts that can be understood independently. Keep state as close as possible to where it is used.
- Extract business logic, including derived-state calculations, into pure functions or methods and cover them with unit tests. Components should remain simple and focus on UI composition.
- Use kebab-case for new file and directory names unless a framework or tool requires a conventional name.

