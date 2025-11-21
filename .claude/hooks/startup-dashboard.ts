#!/usr/bin/env bun

/**
 * startup-dashboard.ts
 *
 * VOX System Startup Dashboard - displays system status and recent sessions
 * Outputs via systemMessage to ensure visibility in Claude Code
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { homedir } from 'os';

const paiDir = process.env.PAI_DIR || join(homedir(), '.claude');
const daName = process.env.DA || 'VOX';

// Colors
const ORANGE = '\x1b[38;5;208m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const termWidth = 120;
const line = '═'.repeat(termWidth - 2);

function stripAnsi(text: string): string {
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(text: string, width: number): string {
  const stripped = stripAnsi(text);
  if (stripped.length >= width) return text.substring(0, text.length - (stripped.length - width));
  return text + ' '.repeat(width - stripped.length);
}

function centerText(text: string): string {
  const stripped = stripAnsi(text);
  const padding = Math.floor((termWidth - 2 - stripped.length) / 2);
  const leftPad = ' '.repeat(Math.max(0, padding));
  const rightPad = ' '.repeat(Math.max(0, termWidth - 2 - padding - stripped.length));
  return '║' + leftPad + text + rightPad + '║';
}

function twoColumn(left: string, right: string): string {
  const leftWidth = 45;
  const rightWidth = termWidth - 6 - leftWidth;
  return '║  ' + pad(left, leftWidth) + '  ' + pad(right, rightWidth) + '║';
}

function emptyLine(): string {
  return '║' + ' '.repeat(termWidth - 2) + '║';
}

async function main() {
  try {
    // Check if subagent - exit silently
    const claudeProjectDir = process.env.CLAUDE_PROJECT_DIR || '';
    const isSubagent = claudeProjectDir.includes('/.claude/agents/') ||
                      process.env.CLAUDE_AGENT_TYPE !== undefined;
    if (isSubagent) process.exit(0);

    // VOX Logo
    const currentDate = new Date().toLocaleString();
    const voxLogo = [
      `${CYAN}${BOLD}V O X${RESET}`,
      `${ORANGE}${BOLD}▄▀▄${RESET}`,
      `${ORANGE}${BOLD}▁▃█   █▃▁${RESET}`,
      `${ORANGE}▔▔▔   ▔▔▔${RESET}`,
      `${ORANGE}▔▔▔▔▔▔▔▔▔${RESET}`
    ];

    // Get last 3 sessions (skip the current/most recent one)
    let sessionLines: string[][] = [];
    try {
      const logFiles = execSync(`ls -t ${paiDir}/history/raw-outputs/2025-11/*.jsonl 2>/dev/null`).toString().trim().split('\n');
      let sessionsFound = 0;
      let sessionsSkipped = 0;
      const sessionIds = new Set<string>();

      for (const logFile of logFiles) {
        if (sessionsFound >= 3) break;
        if (!logFile) continue;

        try {
          const sessions = execSync(`grep '"SessionStart"' ${logFile} | tail -10`).toString().trim().split('\n').reverse();

          for (const sessionLine of sessions) {
            if (sessionsFound >= 3) break;
            if (!sessionLine) continue;

            try {
              const startEvent = JSON.parse(sessionLine);
              const sessionId = startEvent.session_id;
              if (sessionIds.has(sessionId)) continue;
              sessionIds.add(sessionId);

              // Skip the first (most recent/current) session
              if (sessionsSkipped === 0) {
                sessionsSkipped++;
                continue;
              }

              const time = new Date(startEvent.timestamp);
              const timeStr = time.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              let firstPrompt = 'No user input';
              try {
                const userPromptOutput = execSync(
                  `grep '"${sessionId}"' ${logFile} | grep '"UserPromptSubmit"' | head -1 | jq -r '.payload.prompt'`
                ).toString().trim();

                if (userPromptOutput && userPromptOutput !== 'null') {
                  firstPrompt = userPromptOutput.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                }
              } catch (e) {}

              // Truncate to fit right column
              if (firstPrompt.length > 50) firstPrompt = firstPrompt.substring(0, 50) + '...';

              // Store as pair: [date/time line, prompt line with session ID]
              const sessionIdShort = sessionId.substring(0, 8);
              sessionLines.push([
                `${CYAN}${timeStr}${RESET} ${DIM}${sessionIdShort}${RESET}`,
                `${firstPrompt}`
              ]);

              sessionsFound++;
            } catch (e) {}
          }
        } catch (e) {}
      }
    } catch (e) {
      sessionLines = [[`${DIM}No recent sessions${RESET}`, '']];
    }

    // Voice server status
    let voiceStatus = `${RED}❌ OFFLINE${RESET}`;
    try {
      execSync('lsof -ti:9999 2>/dev/null');
      voiceStatus = `${GREEN}✅ RUNNING${RESET} ${DIM}(port 9999)${RESET}`;
    } catch {}

    // Git status
    let gitBranch = `${DIM}N/A${RESET}`;
    let gitChanges = `${DIM}Not a repo${RESET}`;
    try {
      const branch = execSync('git branch --show-current 2>/dev/null').toString().trim();
      const status = execSync('git status --porcelain 2>/dev/null').toString().trim();
      const changes = status.split('\n').filter(Boolean).length;
      gitBranch = `${MAGENTA}${branch}${RESET}`;
      gitChanges = changes > 0 ? `${YELLOW}${changes} uncommitted${RESET}` : `${GREEN}Clean${RESET}`;
    } catch {}

    // Hooks count
    let hooksCount = 0;
    try {
      const settings = JSON.parse(readFileSync(join(paiDir, 'settings.json'), 'utf-8'));
      hooksCount = Object.keys(settings.hooks || {}).length;
    } catch {}

    // MCP servers count
    let mcpCount = 0;
    try {
      const mcpConfig = JSON.parse(readFileSync(join(paiDir.replace('/.claude', ''), '.mcp.json'), 'utf-8'));
      mcpCount = Object.keys(mcpConfig.mcpServers || {}).length;
    } catch {}

    // Build rows - system status on left, sessions on right (2 lines each)
    let rows: string[] = [];

    // Header row
    rows.push(twoColumn(`${BOLD}${BLUE}SYSTEM STATUS${RESET}`, `${BOLD}${BLUE}RECENT SESSIONS${RESET} ${DIM}(Last 3)${RESET}`));
    rows.push(emptyLine());

    // Session 1 (2 lines)
    rows.push(twoColumn(`Voice Server:  ${voiceStatus}`, sessionLines[0] ? sessionLines[0][0] : ''));
    rows.push(twoColumn(`Git Branch:    ${gitBranch}`, sessionLines[0] ? sessionLines[0][1] : ''));

    // Session 2 (2 lines)
    rows.push(twoColumn(`Git Status:    ${gitChanges}`, sessionLines[1] ? sessionLines[1][0] : ''));
    rows.push(twoColumn(`Hooks:         ${GREEN}${hooksCount} configured${RESET}`, sessionLines[1] ? sessionLines[1][1] : ''));

    // Session 3 (2 lines)
    rows.push(twoColumn(`MCP Servers:   ${GREEN}${mcpCount} configured${RESET}`, sessionLines[2] ? sessionLines[2][0] : ''));
    rows.push(twoColumn(`Working Dir:   ${DIM}${process.cwd().split('/').slice(-2).join('/')}${RESET}`, sessionLines[2] ? sessionLines[2][1] : ''));

    const dashboard = `
${BOLD}${ORANGE}╔${line}╗${RESET}
${voxLogo.map(line => centerText(line)).join('\n')}
${centerText(`${DIM}${currentDate}${RESET}`)}
${emptyLine()}
${BOLD}${ORANGE}╠${line}╣${RESET}
${rows.join('\n')}
${emptyLine()}
${BOLD}${ORANGE}╚${line}╝${RESET}
`;

    // Output as systemMessage so it's visible to the user
    console.log(JSON.stringify({ systemMessage: dashboard }));
    process.exit(0);
  } catch (error) {
    console.error('Startup dashboard error:', error);
    process.exit(1);
  }
}

main();
