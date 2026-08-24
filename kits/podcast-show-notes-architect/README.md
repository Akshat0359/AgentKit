<a href="https://studio.lamatic.ai/template/podcast-show-notes-architect" target="_blank" style="text-decoration:none;">
  <div align="right">
    <span style="display:inline-block;background:#e63946;color:#fff;border-radius:6px;padding:10px 22px;font-size:16px;font-weight:bold;letter-spacing:0.5px;text-align:center;transition:background 0.2s;box-shadow:0 2px 8px 0 #0001;">Deploy on Lamatic</span>
  </div>
</a>

# 🎙️ Podcast Show Notes Architect

> **Turn any podcast transcript into publication-ready show notes and a 9-part promotional thread — in seconds.**

Podcast creators spend 60–90 minutes per episode writing show notes, hunting for great quotes, and crafting social content. This template automates the entire workflow with a single API call.

---

## What This Template Does

Given a raw podcast transcript, this flow:

1. **Extracts structured intelligence** — episode summary, 5 key takeaways, 3 timestamped quotable moments, and 5–8 topic tags.
2. **Generates publication-ready show notes** — a complete Markdown document with SEO-optimized title, formatted quotes, numbered takeaways, and topic hashtags.
3. **Generates a promotional social thread** — a 9-part Twitter/LinkedIn thread with a hook, context, takeaways, a pull-quote, and a CTA.

---

## Flow Architecture

```
API Request
    │
    ▼
Extract Structure  ← [InstructorLLM: JSON-constrained extraction]
    │
    ├──────────────────────────┐
    ▼                          ▼
Generate Show Notes     Generate Social Thread
[LLM: Markdown doc]    [LLM: 9-tweet thread]
    │                          │
    └──────────┬───────────────┘
               ▼
          API Response
     { show_notes, social_thread }
```

---

## Inputs

| Field | Type | Required | Description |
|---|---|---|---|
| `transcript` | `string` | ✅ Yes | Full raw text of the podcast transcript |
| `podcast_title` | `string` | Optional | Name of the podcast show |
| `episode_number` | `string` | Optional | Episode number/identifier (e.g., "Episode 87") |
| `guest_names` | `string` | Optional | Guest name(s), comma-separated |
| `host_names` | `string` | Optional | Host name(s), comma-separated |

---

## Outputs

| Field | Type | Description |
|---|---|---|
| `show_notes` | `string` | Complete Markdown show notes document, ready to publish |
| `social_thread` | `string` | 9-part promotional Twitter/LinkedIn thread, ready to post |

---

## Example Request

```json
{
  "transcript": "Host: Welcome back everyone. Today I'm joined by Sarah Mitchell, who built a $10M ARR SaaS company bootstrapped in 18 months...\nSarah: Thanks Alex, happy to be here. The key thing most founders miss is...",
  "podcast_title": "The Founders Podcast",
  "episode_number": "Episode 87",
  "host_names": "Alex Chen",
  "guest_names": "Sarah Mitchell"
}
```

---

## Example Output Snippet

**`show_notes`** (excerpt):
```markdown
## Episode 87 – How Sarah Mitchell Built $10M ARR Without a Single VC Dollar

**The Founders Podcast** | Sarah Mitchell × Alex Chen

### Episode Summary
Sarah Mitchell, founder of [Company], shares the unconventional strategies...

### 🎯 Key Takeaways
1. **On bootstrapping:** Start with a paying customer before writing a single line of code...
```

**`social_thread`** (excerpt):
```
Tweet 1:
Most founders raise VC money before they have a single paying customer.
Sarah Mitchell built $10M ARR without raising a dollar.
Here's what I learned 🧵👇

Tweet 2:
Just spoke with @SarahMitchell on the latest episode of The Founders Podcast...
```

---

## Setup

### Prerequisites
- A [Lamatic.ai](https://lamatic.ai) account
- An LLM provider API key (e.g., Gemini, OpenAI, Anthropic)

### Configuration Requirements

This flow requires model configuration for **3 nodes**:

| Node | Purpose |
|---|---|
| `Extract Structure` (InstructorLLM) | Structured JSON extraction from transcript |
| `Generate Show Notes` (LLM) | Show notes document composition |
| `Generate Social Thread` (LLM) | Social media thread composition |

For each node, select your preferred LLM model and provide credentials in Lamatic Studio.

### Deploy Steps
1. Click **Deploy on Lamatic** above, or import this template into [Lamatic Studio](https://studio.lamatic.ai).
2. Configure all three LLM nodes with your model and credentials.
3. Deploy the flow.
4. Call the API with your transcript and optional metadata.
5. Receive `show_notes` and `social_thread` in the response.

---

## Common Issues

| Problem | Fix |
|---|---|
| No timestamps in show notes quotes | Add `[MM:SS]` markers to your transcript before submitting |
| Generic or low-quality output | Provide a fuller transcript with clear speaker attribution |
| Missing `social_thread` or `show_notes` in response | Verify both LLM nodes are correctly wired to the response node |
| Request fails | Ensure `transcript` field is present and non-empty |

---

## Support

- 📖 [Lamatic Documentation](https://docs.lamatic.ai)
- 💬 [GitHub Discussions](https://github.com/Lamatic/AgentKit/discussions)
- 🐛 [Report an Issue](https://github.com/Lamatic/AgentKit/issues)

---

*Part of the [Lamatic AgentKit](https://github.com/Lamatic/AgentKit) template library.*
