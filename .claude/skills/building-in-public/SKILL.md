---
name: building-in-public
description: Content strategy system for building Richard's personal brand through transparent development sharing. MCP-powered research, trend analysis, and publishing automation for X/Twitter, LinkedIn, and blog. USE WHEN user says 'plan week', 'content strategy', 'write article', or building-in-public related tasks.
---

# Building in Public - Content Strategy System

**Owner**: Richard Thompson (Cognitive Scientist → AI Engineer)
**Integration**: Vox AI System with MCP access

---

## GOAL

To build a workflow to build my personal brand as an AI Engineer and Software developer through "building in public"—a proven strategy for creating opportunities, audience, and revenue by transparently sharing my development journey.

- Professional online presence across 2-3 platforms (X/Twitter, YouTube/Blog, LinkedIn)
- Consistent content workflow integrated with your development process
- Growing engaged audience
- Career opportunities through visibility and networking

## RESOURCES

* Twitter: https://x.com/Richardmthompsn
* LinkedIn: https://www.linkedin.com/in/richardmthompsoncognitivescientist/
* Blog: https://richardmthompson.hashnode.dev/

## Accessing the Resources as Vox

MCP servers provide web access:
- **BrightData**: Web scraping for trend research and competitor analysis
- **Apify**: Automated content research and social media monitoring
- **Playwright**: Browser automation for cross-posting and analytics monitoring

---

## File Structure & Update Frequency

**Evergreen (Rarely Update)** - Skill Directory (`.claude/skills/building-in-public/`):
- `STRATEGY-AND-PLANNING-GUIDE.md` - Planning processes
- `WORKFLOW.md` - Batching system and platform formats
- `IMPLEMENTATION-GUIDE.md` - 12-month roadmap
- `CONTENT-STRATEGY.md` - **SINGLE SOURCE OF TRUTH** for pillars, assets, backlog
- `platforms/twitter-x.md` - X/Twitter platform strategy
- `platforms/youtube.md` - YouTube platform strategy

**Time-Bound (Update Regularly)** - Codex Projects (`.claude/codex/projects/building-in-public/`):
- `WEEKLY-TRACKER.md` - Reset every Monday
- `plans/[MONTH]-PLAN.md` - Create new file first Monday of month (e.g., `NOV-2024-PLAN.md`)

**Drafts & Planning** - Codex Projects (`.claude/codex/projects/building-in-public/drafts/`):
- Article frameworks and partial drafts
- Use naming: `rmt_[number]_[topic-slug].md`
- Example: `rmt_2_ai_tooling.md`
- Includes: Full article framework (8 elements) + draft content + derivative content (social hooks)

---

## Key Commands

### Slash Commands
- `/building-in-public:plan-week` - Generate complete weekly plan (use every Monday)
- `/building-in-public:whatrightnow` - Get top 3 immediate actions (use when stuck)

### Update Workflows
```bash
# Weekly planning (every Monday)
1. Read .claude/codex/projects/building-in-public/WEEKLY-TRACKER.md (last week's progress)
2. Read .claude/codex/projects/building-in-public/plans/[MONTH]-PLAN.md (this month's goals)
3. Read .claude/skills/building-in-public/CONTENT-STRATEGY.md (pillar percentages)
4. Generate new weekly plan
5. Update WEEKLY-TRACKER.md with new week's tasks

# Monthly planning (first Monday of month)
1. Review last month's plan in plans/ directory
2. Update CONTENT-STRATEGY.md (add published assets)
3. Create new plans/[MONTH]-PLAN.md using template from STRATEGY-AND-PLANNING-GUIDE.md Section 3
4. Run weekly planning for Week 1
```

---

## Content Pillars (SSOT: CONTENT-STRATEGY.md)

**Baseline Percentages** (reference only, do NOT edit):
1. Voice-First Cognitive Systems (35%)
2. Cognitive Architecture for AI (25%)
3. Building Agentic Systems (20%)
4. Goal Systems & Intentionality (15%)
5. Radical Honesty & Learning Journey (5%)

**IMPORTANT**: Pillar definitions and baseline percentages are ONLY in `.claude/skills/building-in-public/CONTENT-STRATEGY.md`. Monthly plans reference these but don't redefine them.

---

## Core Principles

1. **Document, don't create extra** - Content = development work documentation
2. **Anchor → Derivative** - 1 blog post → 10+ repurposed pieces
3. **Radical honesty** - Unfiltered transparency, show failures
4. **Old school hacker ethos** - Provide value, not self-promotion
5. **Sustainability first** - Process must be maintainable
6. **Preserve SSOT** - Content pillars defined ONLY in CONTENT-STRATEGY.md

---

## DO NOT

- ❌ **NEVER edit pillar baseline percentages** outside CONTENT-STRATEGY.md
- ❌ **NEVER overwrite WEEKLY-TRACKER.md** without reading it first
- ❌ **NEVER create monthly plans** without checking template in STRATEGY-AND-PLANNING-GUIDE.md Section 3
- ❌ **NEVER duplicate pillar definitions** - reference CONTENT-STRATEGY.md
- ❌ **NEVER reset WEEKLY-TRACKER.md** on days other than Monday
- ❌ **NEVER update evergreen docs** (STRATEGY, WORKFLOW, IMPLEMENTATION) without explicit request

---

## Voice & Style Guidelines

**Richard's Writing Style**:
- Technical depth + philosophical foundation
- Honest about failures and uncertainties
- Cognitive science background evident
- Old school hacker vibes (helpful, not promotional)
- Conversational but substantive

**Content Tone**:
- X/Twitter: Direct, punchy, insight-driven
- LinkedIn: Professional but authentic
- Blog: Comprehensive, tutorial-style, educational
- All platforms: No fluff, value-first

---

## Common Tasks

**When planning weekly**:
1. Run `/building-in-public:plan-week` or follow STRATEGY-AND-PLANNING-GUIDE.md Section 2
2. Always read `.claude/codex/projects/building-in-public/WEEKLY-TRACKER.md` first
3. Check `.claude/codex/projects/building-in-public/plans/[MONTH]-PLAN.md` for this week's theme
4. Reference `.claude/skills/building-in-public/WORKFLOW.md` for batching schedule
5. Update `WEEKLY-TRACKER.md` with new tasks

**When user is stuck**:
1. Run `/building-in-public:whatrightnow` or check WEEKLY-TRACKER.md
2. Identify completed vs. pending tasks
3. Return top 3 priorities with time estimates

**When creating content**:
1. Check CONTENT-STRATEGY.md for pillar to emphasize
2. Reference WORKFLOW.md for platform-specific formats
3. Use Richard's voice (technical + philosophical + honest)
4. Document actual work, don't create separate content

**When updating progress**:
1. Mark completed tasks in WEEKLY-TRACKER.md
2. Add retrospective notes (what worked, what didn't)
3. Capture new ideas for CONTENT-STRATEGY.md backlog

**When planning long-form articles**:
1. Read source material from `.claude/codex/projects/building-in-public/materials/`
2. Analyze existing draft (word count, sections)
3. Project total length (current + remaining sections)
4. If >5,000 words: Split into series
5. Create article framework in `.claude/codex/projects/building-in-public/drafts/[name].md`
6. Complete all 8 framework elements:
   - Thesis, Narrative Arc, Key Learnings, Proposed Structure
   - SEO Keywords, Social Media Hooks, Evidence Sources, Next Steps
7. Generate derivative content from framework (threads, posts, quotes)
8. Update CONTENT-STRATEGY.md backlog with series plan

---

## Article Planning & Structure

### Article Length Guidelines

**Hashnode/Dev.to** (primary platforms):
- **Sweet spot**: 1,500-3,000 words (6-12 min read)
- **Long-form acceptable**: 3,000-5,000 words (12-20 min read)
- **Epic post**: 5,000-7,000 words (20-28 min read)
- **Diminishing returns**: 7,000+ words (skim/bounce risk)

**Split into series when**:
- Article exceeds 5,000 words
- Multiple distinct themes/topics
- Can create standalone pieces
- Want multiple launch moments

### Article Framework Template

**Location**: `.claude/codex/projects/building-in-public/drafts/[article-name].md`

**8 Required Elements**:

1. **Article Thesis**
   - Core insight/argument (1-2 sentences)
   - Example: "Learning to build AI systems in the age of AI tools requires developing wisdom about when to use the tools and when to resist them - a meta-skill that can't be automated."

2. **Narrative Arc**
   - Story structure (3-5 acts/phases)
   - Example: Act 1: Foundation → Act 2: Discovery → Act 3: Crisis → Act 4: Migration → Act 5: Maturity

3. **Key Learnings**
   - Extract specific lessons (5-7 principles)
   - Example: "The Timing Paradox", "The Context Discovery", "The Configuration Wisdom"

4. **Proposed Structure**
   - Sections with word counts
   - Example: Hook (~200 words), Part 1 (~400 words), Part 2 (~500 words), etc.

5. **SEO Keywords**
   - Primary (3-5): Main topic keywords
   - Secondary (5-8): Related terms
   - Long-tail (3-5): Specific search phrases

6. **Social Media Hooks**
   - X/Twitter thread starters (5+ variants)
   - LinkedIn post openers (3-5 variants)
   - Include in framework for easy extraction later

7. **Evidence Sources**
   - Where to pull quotes/data from
   - Example: `.claude/codex/projects/building-in-public/materials/timeline_summary.md` → Dead Ends section

8. **Next Steps**
   - Checklist for completion
   - Example: "Expand sections, add code examples, fact-check dates, publish"

### When Planning Long-Form Articles

**Step 1: Analyze existing material**
- Read source docs from `.claude/codex/projects/building-in-public/materials/`
- Identify word count of drafted sections
- Project total length if all sections completed

**Step 2: Strategic decision**
- **If <5,000 words projected**: Complete as single article
- **If >5,000 words projected**: Split into series

**Step 3: Create article framework(s)**
- Extract distinct themes → separate articles
- Build narrative arc for each
- Identify overlapping vs. unique content
- Plan publishing sequence (Article 1 → 2 → 3)

**Step 4: Complete all 8 framework elements**
- Thesis, arc, learnings, structure (content planning)
- SEO, social hooks, evidence, next steps (publishing planning)
- Save to `.claude/codex/projects/building-in-public/drafts/[name].md`

---

## Derivative Content Strategy

### Anchor → Derivative Principle

**1 blog post = 10-20 pieces of derivative content**

**Extract from article framework**:
1. **X/Twitter threads** (5-10 threads)
   - Use "Social Media Hooks" from framework
   - Each hook = thread starter
   - Extract quotes from article sections

2. **LinkedIn posts** (3-5 posts)
   - Professional openers from framework
   - Longer-form (1,500 characters)
   - Link to full article

3. **Quote cards** (5-10 images)
   - Pull quotable insights from "Key Learnings"
   - Format for visual sharing

4. **Code snippets** (if applicable)
   - GitHub gists
   - Standalone examples from article

5. **Follow-up articles** (2-3 concepts)
   - Deep-dive on single learning
   - Expand single section into full post

**Note**: All derivative content lives in article framework file - no separate social_content folder needed.

### Social Media Hook Templates

**X/Twitter format** (280 characters max):
```
[Attention-grabbing statement]
[Specific detail/number]
[Thread indicator: 🧵]
```

**Example**:
> "In 2023 I learned to code without AI tools. In 2025 I use them daily but not uncritically. Here's what that evolution looked like - and why I'm thankful I hand-coded first. 🧵"

**LinkedIn format** (longer, professional):
```
[Hook question or bold statement]
[Context/credibility builder]
[Promise of value]
[Call to read more]
```

**Example**:
> "The dirty secret about AI coding tools: They amplify good practices AND bad practices equally. After 2 years of AI-assisted development (Cursor → Claude Code → custom agents), here's what actually works... [link]"

### Batch Content Creation

**After article framework created**:
1. Social hooks already in framework (Element #6)
2. Copy/paste hooks to schedule tweets/posts
3. Extract quotes for visual cards (Element #3: Key Learnings)
4. Identify follow-up topics (Element #2: Narrative Arc sections)
5. **Total time**: 15-30 minutes (already done during planning)

---

## Project Context

**Primary Project**: Vox Manifestor/Coherence (voice-first AI for Android)
**Background**: 2 years self-taught AI engineering, cognitive scientist
**Vision**: Vox Systems Inc. - conversational OS, voice-first cognitive partners
**Published Work**: https://richardmthompson.hashnode.dev/

---

**Version**: 2.0 - Vox Integration
**Last Updated**: November 2025
**Migration**: Fully integrated into PAI/Vox system with MCP capabilities
