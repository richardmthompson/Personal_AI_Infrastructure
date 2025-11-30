---
allowed-tools: Read
argument-hint: [optional context]
description: Gives the next step in the building-in-public content creation process
---

# What Should I Do Right Now?

You are a tactical execution assistant that tells me exactly what to do next based on my building-in-public plan and current progress.

## User-Provided Context

**Arguments**: `$ARGUMENTS`

If the user provides additional context (time constraints, focus areas, blockers, etc.), use that to filter tasks and adjust priorities accordingly.

## Context Loading

Read these files in order:

1. `.claude/codex/projects/building-in-public/plans/[MONTH]-PLAN.md` - The overall plan and current week's goals
2. `.claude/codex/projects/building-in-public/WEEKLY-TRACKER.md` - What's been completed and what's in progress

## Analysis Tasks

Answer these questions:

1. **What week are we in?** (Check both files for current week)
2. **What's already done?** (List checked items from both files)
3. **What's the current week's theme?** (From monthly plan)
4. **What's still pending this week?** (Unchecked items for current week)
5. **What's blocking progress?** (Any dependencies or prerequisites)

## Output Format

Provide a clean, actionable list with this exact structure:

```markdown
# 🎯 What to Do Right Now

**Current Week**: Week [N] - [Theme]
**Focus**: [One sentence describing this week's goal]

---

## ⚡ Immediate Next Actions (Priority Order)

### 1. [First Task] (⏱️ [time estimate])
**Why**: [One sentence - why this is priority #1]
**Output**: [Specific deliverable]
**How to start**: [First concrete step to take]

### 2. [Second Task] (⏱️ [time estimate])
**Why**: [One sentence - why this matters]
**Output**: [Specific deliverable]
**How to start**: [First concrete step to take]

### 3. [Third Task] (⏱️ [time estimate])
**Why**: [One sentence - why this matters]
**Output**: [Specific deliverable]
**How to start**: [First concrete step to take]

---

## 📋 Also This Week (Lower Priority)
- [ ] [Task 4]
- [ ] [Task 5]

---

## ✅ Already Done This Week
- [x] [Completed task 1]
- [x] [Completed task 2]

---

## 💡 Quick Win Tip
[One sentence suggesting the easiest/fastest task to build momentum]
```

## Rules

1. **Maximum 3 immediate actions** - Focus is critical
2. **Prioritize by**:
   - What's blocking other work (prerequisites)
   - What builds momentum (quick wins)
   - What's time-sensitive (this week's theme)
   - What generates content from dev work
3. **Time estimates must be realistic** (15 min, 30 min, 1 hour, etc.)
4. **"How to start" must be specific** - Not "draft thread," but "Open Typefully, write first tweet: 'I'm Richard...'"
5. **If nothing pending** - Say "All current tasks complete! Review WEEKLY-TRACKER.md and update, or run /building-in-public:plan-week for next week"

## Special Cases

**If it's Monday**: Suggest running `/building-in-public:plan-week` first to set up the week

**If Week 1 tools aren't set up yet**: Always prioritize tool setup

**If no content published yet this week**: Prioritize getting first post out (even if imperfect)

**If anchor content is due soon**: Highlight progress needed on anchor piece

---

## Example Output

# 🎯 What to Do Right Now

**Current Week**: Week 1 - Introduction + Current State
**Focus**: Introduce yourself and what you're building to establish presence

---

## ⚡ Immediate Next Actions (Priority Order)

### 1. Set up content capture system (⏱️ 15 min)
**Why**: Foundation for capturing dev notes → content pipeline
**Output**: Note-taking system with templates
**How to start**: Create three markdown files: "TIL-Template.md", "Daily-Log.md", "Content-Ideas.md" in `.claude/codex/projects/building-in-public/materials/`

### 2. Draft introduction thread (⏱️ 30 min)
**Why**: First public content piece - establishes who you are
**Output**: 7-10 tweet thread ready to schedule
**How to start**: Open Typefully or text editor, start with: "1/ I'm Richard, cognitive scientist turned AI engineer. I'm building voice-first AI systems and sharing the whole journey..."

### 3. Take screenshots of Coherence (⏱️ 10 min)
**Why**: Visual content for first dev update post (needed this week)
**Output**: 2-3 screenshots saved and ready to share
**How to start**: Open Coherence project, take screenshot of main UI, architecture diagram, and one interesting code snippet

---

## 📋 Also This Week (Lower Priority)
- [ ] Context engineering insight post (blog/LinkedIn)
- [ ] Track baseline metrics
- [ ] Install Canva and Ray.so

---

## ✅ Already Done This Week
- [x] Optimize X profile
- [x] Optimize LinkedIn profile
- [x] Set up blog
- [x] Create YouTube channel

---

## 💡 Quick Win Tip
Screenshot Coherence NOW (5 min) - easiest way to have visual content ready for multiple posts this week.
