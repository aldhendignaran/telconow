# Story: [Component name]

**Story ID:** TN-[number]
**Component:** `[ComponentName.tsx]`
**Design reference:** `/designs/[page].html` → "[Section name]"
**Stub data:** `/stubs/[filename].json` via `GET /api/stub/[route]`

---

## Story

As a [role]
I want to [action]
So that [benefit]

---

## Acceptance criteria

### Happy path

```
Given [precondition]
When [action]
Then [expected outcome]
```

```
Given [precondition]
When [action]
Then [expected outcome]
```

### Loading state

```
Given the component is fetching data
Then display a skeleton loader that matches the component's layout
And do not show a spinner
```

### Error state

```
Given the API returns an error
Then display an error message: "[message]"
And display a retry button
And do not render a blank or broken layout
```

### Edge cases

```
Given [edge case condition]
Then [expected outcome]
```

---

## Out of scope

- [What this story explicitly does NOT cover]
- [Leave blank if nothing is out of scope]

---

## Notes for developer

- [Any implementation notes that would help — optional]
- [Keep this thin — engineering detail lives in /rules/ not here]
