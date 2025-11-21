---
name: job-search
description: |
  Job search assistant for AI/ML/Voice AI engineering roles. Helps find employers,
  research companies, track applications. Start with employer discovery via job boards.
  USE WHEN user says 'find AI jobs', 'search for ML positions', 'look for voice AI companies',
  'find agentic AI employers', or any job search related request in AI/ML space.
---

# Job Search Assistant

## When to Activate This Skill

- User wants to find job opportunities in AI/ML/Voice AI
- Requests job board recommendations
- Asks to search for companies hiring in specific domains
- Needs help with job search in AI/ML/software engineering
- Phrases like:
  - "Find AI engineering jobs"
  - "Search for machine learning positions"
  - "Help me find voice AI companies"
  - "Look for agentic AI employers"
  - "Where can I find chatbot engineering roles?"

## Target Domains

- Software Engineering (AI/ML focus)
- Machine Learning Engineering
- AI Engineering
- Agentic AI Systems
- Voice-based AI Applications
- Conversational AI / Chatbots

## Current Workflow: Find Employers

### Overview
Identify potential employers posting jobs in target domains using curated job board database.

### PROPOSED Initial Steps (TO BE ITERATED)

**Note:** This is a starting proposal to get the wheels moving. We will refine these exact steps in the next phase.

**Step 1: Check job boards database**
```bash
cat ${PAI_DIR}/skills/job-search/data/job-boards.txt
```

**Step 2: Filter by domain**
Identify boards relevant to user's specific interest (e.g., AI safety, voice AI, general ML).

**Step 3: Provide search strategy**
- Relevant job boards for domain
- Recommended search terms
- Key filters to apply

**Step 4: (Future) Automate searching**
Currently manual - future will integrate web scraping or APIs.

**Next:** Iterate on these steps to determine the actual first few actions.

## Job Boards Database

Location: `${PAI_DIR}/skills/job-search/data/job-boards.txt`

Format:
```
[Board Name] | [URL] | [Domains] | [Notes]
```

## Content Organization

All job search outputs save to: `${PAI_DIR}/codex/projects/job-search/`

Structure:
- `BUILD.md` - Build timeline and decisions
- `applications/` - One directory per application (future)
- `research/` - Company research (future)
- `materials/` - Resume, portfolio (future)
- `tracking/` - Application tracking (future)

## Integration with Other Skills

- **research skill**: Use for deep company research (future workflow)
- **fabric skill**: Use for analyzing job descriptions (future workflow)

## Workflow Details

For detailed workflow: `read ${PAI_DIR}/skills/job-search/workflows/find-employers.md`

## Future Workflows (Not Yet Implemented)

- Company research
- Application preparation
- Resume tailoring
- Application tracking
- Networking assistance

## Build Progress

Check current build status: `read ${PAI_DIR}/codex/projects/job-search/BUILD.md`

## Key Principles

1. **Start simple** - Text files, manual process, no over-engineering
2. **Build incrementally** - Add automation only when pattern is validated
3. **Leverage existing skills** - Use research/fabric rather than rebuilding
4. **Organize content** - All outputs in codex for persistence
5. **Track progress** - BUILD.md documents decisions and iterations
