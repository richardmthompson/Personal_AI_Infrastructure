#!/usr/bin/env bun

/**
 * beads-prime.ts
 *
 * Beads integration hook that runs `bd prime` at session start.
 * This injects the Beads workflow context into Claude Code sessions.
 *
 * What it does:
 * - Checks if .beads/ directory exists in current project
 * - If found, runs `bd prime` to inject workflow documentation (~1-2k tokens)
 * - Skips for subagent sessions (they inherit context from parent)
 *
 * Setup:
 * - Add to SessionStart hooks in settings.json
 * - No configuration required - auto-detects .beads/ presence
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { $ } from 'bun';

async function main() {
  try {
    // Check if this is a subagent session - if so, skip
    const claudeProjectDir = process.env.CLAUDE_PROJECT_DIR || '';
    const isSubagent = claudeProjectDir.includes('/.claude/agents/') ||
                      process.env.CLAUDE_AGENT_TYPE !== undefined;

    if (isSubagent) {
      // Subagents inherit context from parent session
      process.exit(0);
    }

    // Check if .beads/ directory exists
    const cwd = process.cwd();
    const beadsDir = join(cwd, '.beads');

    if (!existsSync(beadsDir)) {
      // No beads in this project - skip silently
      process.exit(0);
    }

    // Run bd prime to inject workflow context
    console.log('# Beads Workflow Context\n');

    const result = await $`bd prime`.text();
    console.log(result);

    console.log('\n<system-reminder>');
    console.log('This project uses bd (beads) for tracked work items.');
    console.log('TodoWrite can still be used for temporary planning/exploration.');
    console.log('</system-reminder>');

    process.exit(0);
  } catch (error) {
    console.error('beads-prime hook error:', error);
    // Non-fatal - don't block session start if bd prime fails
    process.exit(0);
  }
}

main();
