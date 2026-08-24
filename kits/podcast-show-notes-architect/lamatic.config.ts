export default {
  name: "Podcast Show Notes Architect",
  description: "Transforms raw podcast transcripts into structured, publication-ready show notes. Extracts top takeaways, identifies quotable moments with timestamps, and generates promotional social media threads for Twitter/LinkedIn.",
  version: '1.0.0',
  type: 'template' as const,
  author: {"name":"Akshat Prabhakar","email":"akshat.prabhakar5903@gmail.com"},
  tags: ["podcast", "content-creation", "social-media", "generative", "automation"],
  steps: [
    { id: "podcast-show-notes-architect", type: 'mandatory' as const }
  ],
  links: {
    "github": "https://github.com/Lamatic/AgentKit/tree/main/kits/podcast-show-notes-architect"
  },
};
