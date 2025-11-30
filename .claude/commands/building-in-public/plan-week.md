# Weekly Planning Protocol for Building in Public

You are an executive function agent that synthesizes building-in-public strategy documents into specific, executable weekly plans.

## Context Loading Sequence

Follow this exact order to load context:

### 1. Current State Assessment
Read `.claude/codex/projects/building-in-public/WEEKLY-TRACKER.md`:
- What week/phase are we in?
- What was completed last week?
- What metrics were tracked?
- What adjustments were noted?

### 2. Monthly Planning Context
Read `.claude/codex/projects/building-in-public/plans/[MONTH]-PLAN.md`:
- Find the current week's theme
- Identify key goals for this week
- Note deliverables expected
- Review time commitments

### 3. Phase-Specific Guidance
Read `.claude/skills/building-in-public/IMPLEMENTATION-GUIDE.md`:
- Find the current phase section
- Identify phase goals
- Review phase deliverables
- Note recommended time commitments

### 4. Workflow Framework
Read `.claude/skills/building-in-public/WORKFLOW.md`:
- Review weekly batching system (Monday-Friday structure)
- Check content formats by platform
- Review time estimates per content type
- Note key principles (sustainability, repurposing)

### 5. Content Strategy
Read `.claude/skills/building-in-public/CONTENT-STRATEGY.md`:
- Review the 5 content pillars and percentages
- Identify which pillars to emphasize this week
- Note specific content streams available
- Check backlog for ready-to-execute ideas

## Analysis Questions

Answer these questions explicitly:

1. **Where are we?**
   - Current phase and week number
   - Days into current week
   - Completion percentage of current phase

2. **What did we accomplish?**
   - List completed tasks from WEEKLY-TRACKER.md
   - Note any metrics collected
   - Identify what worked well

3. **What does the plan say we should do?**
   - Expected activities for current week (from monthly plan)
   - Alignment with IMPLEMENTATION-GUIDE.md goals
   - Any gaps or deviations

4. **Content distribution this week**
   - Calculate pillar percentages for this week's content
   - Map specific topics to content pillars
   - Ensure variety and balance

5. **Realistic time commitment**
   - Total hours available this week
   - Allocation across days (using WORKFLOW.md batching)
   - Buffer for engagement (10 min daily)

## Weekly Plan Output Format

Generate output in this structure:

```markdown
# Week [N] Plan: [Dates]
**Phase**: [Phase name]
**Focus**: [1-2 sentence summary of week's theme]

## This Week's Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Daily Task Breakdown

### Monday ([Date]) - Plan & Ideate (1 hour)
- [ ] Review last week's analytics (15 min)
- [ ] Brainstorm 5-7 content ideas (20 min)
- [ ] Outline ideas in notes (10 min)
- [ ] Daily engagement: 5-10 creators (10 min)

**Content Ideas**:
- Idea 1: [Topic] - [Pillar X] - [Format]
- Idea 2: [Topic] - [Pillar X] - [Format]
...

### Tuesday ([Date]) - Create Batch 1 (2 hours)
- [ ] Draft 3-4 X posts (45 min)
- [ ] Draft 2 LinkedIn posts (45 min)
- [ ] Create code snippets if needed (30 min)
- [ ] Daily engagement (10 min)

**Specific Content**:
- X Post 1: [Specific topic/angle]
- X Post 2: [Specific topic/angle]
...

### Wednesday ([Date]) - Create Batch 2 (2 hours)
- [ ] Refine Tuesday's drafts (30 min)
- [ ] Create visuals (Canva/Ray.so) (45 min)
- [ ] Work on blog post OR video script (45 min)
- [ ] Daily engagement (10 min)

### Thursday ([Date]) - Schedule & Polish (1.5 hours)
- [ ] Edit all posts for clarity (30 min)
- [ ] Add final visuals/screenshots (30 min)
- [ ] Schedule posts in Typefully/Buffer (30 min)
- [ ] Daily engagement (10 min)

### Friday ([Date]) - Anchor Content (1.5 hours)
- [ ] Continue blog post OR record video (1 hour)
- [ ] Plan repurposing for next week (30 min)
- [ ] Daily engagement (10 min)

### Weekend (Optional 2-3 hours)
- [ ] Finish anchor content
- [ ] Record/edit video if scheduled
- [ ] Prep for Monday planning

## Content Mapping

**Pillar Distribution**:
- Pillar 1 (Voice-First): X% - [Specific pieces]
- Pillar 2 (Cognitive Architecture): X% - [Specific pieces]
- Pillar 3 (Agentic Systems): X% - [Specific pieces]
- Pillar 4 (Goal Systems): X% - [Specific pieces]
- Pillar 5 (Radical Honesty): X% - [Specific pieces]

## Expected Deliverables
- [X] X posts scheduled
- [X] LinkedIn posts scheduled
- [X] Blog post (if applicable)
- [X] Video (if applicable)
- Daily engagement completed

## Metrics to Track This Week
- [Metric 1]
- [Metric 2]
- [Metric 3]

## Adjustments from Last Week
- [Any changes based on what worked/didn't work]
```

## Action: Update WEEKLY-TRACKER.md

After generating the plan:
1. Archive last week's section to a "## Past Weeks" section
2. Add new week as "## Week [N] Progress"
3. Update "Current Phase" section
4. Copy daily breakdown into checkboxes
5. Update "Next Planning Session" date

## Final Output

Present:
1. **Summary**: 2-3 sentence overview of the week ahead
2. **Quick Start**: The first 3 tasks to do right now
3. **Full Plan**: Complete daily breakdown (formatted above)
4. **Reminder**: "Run this command again next Monday"

---

## Execution Instructions

When user runs `/building-in-public:plan-week`:

1. Read all 5 context files in order
2. Answer all analysis questions
3. Generate weekly plan in specified format
4. Update WEEKLY-TRACKER.md
5. Present summary and quick start tasks
