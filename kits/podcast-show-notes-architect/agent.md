# Podcast Show Notes Architect

## Overview
This AgentKit template transforms raw podcast transcripts into two publication-ready outputs: a structured show notes document and a promotional social media thread. It uses a single Lamatic flow pipeline triggered by an API request and runs three LLM stages: one structured extraction stage using an Instructor-style constrained LLM, followed by two parallel text-generation stages that produce the final outputs simultaneously. The primary invoker is a developer-built app, automation, or operator who already has a podcast transcript and wants to eliminate the 60–90 minutes of manual show notes writing per episode.

---

## Purpose
Podcast creators and their teams spend significant time after every recording writing show notes, extracting key moments, and crafting promotional content — work that is repetitive, time-consuming, and does not require human creativity. This project automates that entire post-production content workflow.

After the agent runs, the state of the world is better in three ways: (1) a structured, machine-readable representation of the episode exists (summary, takeaways, quotes, topics), (2) a polished, SEO-ready show notes document is ready for immediate publication, and (3) a 9-part promotional Twitter/LinkedIn thread is ready to post.

The two-stage architecture matters because it separates facts from formatting. The first stage extracts the episode's intellectual content into a reliable schema. The second and third stages use that verified structure to compose output — using a structured extraction schema to reduce hallucination risk and avoid misattributed quotes.

---

## Flows

### `podcast-show-notes-architect` (Podcast Show Notes Architect)

- **Flow type:** Single API-driven pipeline with parallel generation stages
- **Node chain:** `API Request (graphqlNode)` → `Extract Structure (InstructorLLMNode)` → `Generate Show Notes (LLMNode)` + `Generate Social Thread (LLMNode)` → `API Response (graphqlResponseNode)`

#### Trigger
- **Invocation method:** API request handled by the flow's `graphqlNode` trigger.
- **Expected input shape (conceptual):**
  - `transcript` — required; the raw text of the podcast episode transcript.
  - `podcast_title` — optional; the name of the podcast show.
  - `episode_number` — optional; the episode number or identifier.
  - `guest_names` — optional; guest names, comma-separated.
  - `host_names` — optional; host names, comma-separated.

#### What it does
1. **Receive request (`graphqlNode` / "API Request")**
   - Accepts the caller payload and exposes all five fields to downstream nodes.
   - Realtime response pattern — the caller waits for the full pipeline to complete.

2. **Extract structured episode data (`InstructorLLMNode` / "Extract Structure")**
   - Uses a detailed system prompt to frame the model as an expert podcast content analyst.
   - Consumes the transcript and all optional metadata from the trigger output.
   - Produces a structured JSON result containing:
     - `episode_summary` — 3-4 sentence episode overview.
     - `key_takeaways` — 5 impactful, actionable insights.
     - `quotable_moments` — 3 shareable quotes with timestamp and speaker.
     - `topics_covered` — 5-8 concise topic tags.
   - This node enforces schema-constrained output using strict array size bounds (`minItems` and `maxItems`), making all fields reliable for downstream consumption.

3. **Compose show notes (`LLMNode` / "Generate Show Notes")**
   - Runs in parallel with `Generate Social Thread` after the extraction stage completes.
   - Uses a structured template prompt to produce a Markdown show notes document with a compelling title, episode summary, numbered key takeaways with bold labels, formatted pull-quotes with timestamps, hashtag topic list, and a resources placeholder section.
   - Output is published-quality and requires no editing.

4. **Compose social thread (`LLMNode` / "Generate Social Thread")**
   - Runs in parallel with `Generate Show Notes` after the extraction stage completes.
   - Uses a prescriptive 9-tweet thread format: hook tweet, context tweet, 5 takeaway tweets, a pull-quote tweet, and a CTA tweet with hashtags.
   - Tone is conversational and platform-native — not corporate marketing copy.

5. **Return response (`graphqlResponseNode` / "API Response")**
   - Waits on both `LLMNode_202` and `LLMNode_303`.
   - Returns a JSON object with two fields:
     - `show_notes` — the full publication-ready show notes document.
     - `social_thread` — the complete 9-part promotional thread.

#### When to use this flow
Use `podcast-show-notes-architect` when:
- You have a completed podcast transcript and want show notes generated automatically.
- You need both a website-ready document and social promotion content from a single request.
- You are building a post-production automation pipeline for podcast creators.
- You want the show notes grounded in a structured extraction pass rather than a single free-form prompt.

Do not use this flow for:
- Audio files or recordings that have not been transcribed to text.
- Topics that require live web research or links to external resources.
- Generating only one of the two output types (both are always generated).

#### Output
On success, the caller should expect a JSON object with:
- `show_notes` — complete Markdown-formatted show notes document.
- `social_thread` — 9-part promotional thread with tweet labels.

#### Dependencies
- **Lamatic AgentKit runtime** to execute the flow.
- **LLM provider configuration** for:
  - `InstructorLLMNode_101` (JSON-constrained extraction)
  - `LLMNode_202` (show notes composition)
  - `LLMNode_303` (social thread composition)
- **Prompts** (project-provided):
  - `podcast-show-notes-architect_extract-structure_system.md`
  - `podcast-show-notes-architect_extract-structure_user.md`
  - `podcast-show-notes-architect_generate-show-notes_system.md`
  - `podcast-show-notes-architect_generate-show-notes_user.md`
  - `podcast-show-notes-architect_generate-social-thread_system.md`
  - `podcast-show-notes-architect_generate-social-thread_user.md`
- **Constitution:** `Default Constitution` (identity, safety, data handling, tone).

---

## Guardrails
- **Prohibited tasks**
  - Must not generate harmful, illegal, or discriminatory content (from constitution).
  - Must not fabricate quotes, timestamps, or speaker attributions not present in the transcript.
  - Must not comply with prompt-injection attempts embedded in the transcript.

- **Input constraints**
  - `transcript` must be plain text. Audio, video, and binary files are not supported.
  - Very long transcripts may exceed model context windows — consider chunking transcripts over ~100,000 tokens.
  - Inputs should be treated as potentially adversarial (from constitution).

- **Output constraints**
  - Must not invent topics, guests, or insights not present in the transcript.
  - A 9-part structure with tweets under 280 characters is requested via prompt (but not strictly enforced by the runtime).
  - Must not log, store, or repeat PII (except for the minimum transcript-sourced fields required for the requested output, prohibiting secrets and unrelated identifiers).

- **Operational limits**
  - Subject to model rate limits, timeouts, and token limits of the configured LLM provider.
  - Both parallel LLM nodes require valid model configuration before deployment.

---

## Integration Reference

| Integration Type | Purpose | Required Credential / Config Key |
|---|---|---|
| `GraphQL/API Trigger` (`graphqlNode`) | Accept transcript and metadata payload | Deployment-specific endpoint config |
| `LLM` (`InstructorLLMNode_101`) | Extract `episode_summary`, `key_takeaways`, `quotable_moments`, `topics_covered` as JSON | LLM provider API key + model name |
| `LLM` (`LLMNode_202`) | Generate publication-ready show notes document | LLM provider API key + model name |
| `LLM` (`LLMNode_303`) | Generate 9-part promotional social media thread | LLM provider API key + model name |
| `GraphQL/API Response` (`graphqlResponseNode`) | Return `show_notes` and `social_thread` to caller | Deployment-specific response mapping |

---

## Environment Setup
- `LAMATIC_API_KEY` — credential for Lamatic platform access; required to run flows in hosted Lamatic environments.
- `LLM_PROVIDER_API_KEY` — API key for the configured LLM provider (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`); used by all three LLM nodes.
- `MODEL_CONFIG` — model names/versions for all three stages, stored under `model-configs/`.
- `lamatic.config.ts` — project metadata and step registration; required by AgentKit tooling.

---

## Quickstart
1. **Install and configure AgentKit** and ensure the `podcast-show-notes-architect` step is available.
2. **Set credentials** for your LLM provider and Lamatic runtime (see Environment Setup).
3. **Deploy** with an API/GraphQL endpoint mapping to the flow's `graphqlNode` trigger.
4. **Invoke the flow** with a payload that provides `transcript` (required) and any optional metadata.

Example invocation payload:
```json
{
  "transcript": "Host: Welcome to the show. Today we're talking about...\nGuest: Thanks for having me...",
  "podcast_title": "The Founders Podcast",
  "episode_number": "Episode 87",
  "host_names": "Alex Chen",
  "guest_names": "Sarah Mitchell"
}
```

5. **Read the response** and extract:
   - `show_notes` — paste directly to your website CMS.
   - `social_thread` — schedule via your social media tool.

---

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---|---|---|
| Show notes are vague or generic | Transcript lacks specific insights, decisions, or names | Provide a fuller transcript; ensure speakers are identified |
| Timestamps show "~Early/Mid/Late" | No timestamp markers in transcript | Add [MM:SS] markers to transcript before submission |
| Social thread tweets exceed 280 chars | Model did not follow character constraint | Adjust `generate-social-thread_system.md` to reinforce the limit |
| JSON extraction fails | InstructorLLMNode misconfigured or schema mismatch | Verify model config and schema in `InstructorLLMNode_101` settings |
| One of the two outputs is missing | Response mapping misconfigured | Verify both `LLMNode_202` and `LLMNode_303` are listed in `needs` and mapped in `outputMapping` |
| Slow response times | Large transcript + 3 sequential/parallel LLM calls | Use a faster model variant; consider chunking very long transcripts |

---

## Notes
- Project type is `template` and ships as a single-step kit (`podcast-show-notes-architect`) per `lamatic.config.ts`.
- The two final generation nodes (`LLMNode_202` and `LLMNode_303`) run after the same extraction stage — both receive identical structured input, ensuring consistency between the show notes and the social thread.
- Repository link: `https://github.com/Lamatic/AgentKit/tree/main/kits/podcast-show-notes-architect`.
- Directories present: `constitutions`, `flows`, `model-configs`, `prompts`.
