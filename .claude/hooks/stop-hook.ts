#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { sendNotification } from './lib/pai-notifications.js';

/**
 * Generate 4-word tab title summarizing what was done
 */
function generateTabTitle(prompt: string, completedLine?: string): string {
  // If we have a completed line, try to use it for a better summary
  if (completedLine) {
    const cleanCompleted = completedLine
      .replace(/\*+/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/🎯\s*COMPLETED:\s*/gi, '')
      .trim();

    // Extract meaningful words from the completed line
    const completedWords = cleanCompleted.split(/\s+/)
      .filter(word => word.length > 2 &&
        !['the', 'and', 'but', 'for', 'are', 'with', 'his', 'her', 'this', 'that', 'you', 'can', 'will', 'have', 'been', 'your', 'from', 'they', 'were', 'said', 'what', 'them', 'just', 'told', 'how', 'does', 'into', 'about', 'completed'].includes(word.toLowerCase()))
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    if (completedWords.length >= 2) {
      // Build a 4-word summary from completed line
      const summary = completedWords.slice(0, 4);
      while (summary.length < 4) {
        summary.push('Done');
      }
      return summary.slice(0, 4).join(' ');
    }
  }

  // Fall back to parsing the prompt
  const cleanPrompt = prompt.replace(/[^\w\s]/g, ' ').trim();
  const words = cleanPrompt.split(/\s+/).filter(word =>
    word.length > 2 &&
    !['the', 'and', 'but', 'for', 'are', 'with', 'his', 'her', 'this', 'that', 'you', 'can', 'will', 'have', 'been', 'your', 'from', 'they', 'were', 'said', 'what', 'them', 'just', 'told', 'how', 'does', 'into', 'about'].includes(word.toLowerCase())
  );

  const lowerPrompt = prompt.toLowerCase();

  // Find action verb if present
  const actionVerbs = ['test', 'rename', 'fix', 'debug', 'research', 'write', 'create', 'make', 'build', 'implement', 'analyze', 'review', 'update', 'modify', 'generate', 'develop', 'design', 'deploy', 'configure', 'setup', 'install', 'remove', 'delete', 'add', 'check', 'verify', 'validate', 'optimize', 'refactor', 'enhance', 'improve', 'send', 'email', 'help', 'updated', 'fixed', 'created', 'built', 'added'];

  let titleWords = [];

  // Check for action verb
  for (const verb of actionVerbs) {
    if (lowerPrompt.includes(verb)) {
      // Convert to past tense for summary
      let pastTense = verb;
      if (verb === 'write') pastTense = 'Wrote';
      else if (verb === 'make') pastTense = 'Made';
      else if (verb === 'send') pastTense = 'Sent';
      else if (verb.endsWith('e')) pastTense = verb.charAt(0).toUpperCase() + verb.slice(1, -1) + 'ed';
      else pastTense = verb.charAt(0).toUpperCase() + verb.slice(1) + 'ed';

      titleWords.push(pastTense);
      break;
    }
  }

  // Add most meaningful remaining words
  const remainingWords = words
    .filter(word => !actionVerbs.includes(word.toLowerCase()))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Fill up to 4 words total
  for (const word of remainingWords) {
    if (titleWords.length < 4) {
      titleWords.push(word);
    } else {
      break;
    }
  }

  // If we don't have enough words, add generic ones
  if (titleWords.length === 0) {
    titleWords.push('Completed');
  }
  if (titleWords.length === 1) {
    titleWords.push('Task');
  }
  if (titleWords.length === 2) {
    titleWords.push('Successfully');
  }
  if (titleWords.length === 3) {
    titleWords.push('Done');
  }

  return titleWords.slice(0, 4).join(' ');
}

/**
 * Set terminal tab title (works with Kitty, Ghostty, iTerm2, etc.)
 */
function setTerminalTabTitle(title: string): void {
  // Get terminal type
  const term = process.env.TERM || '';

  // Send to stderr to bypass potential output filtering

  if (term.includes('ghostty')) {
    // Ghostty-specific sequences
    // Ghostty uses standard xterm sequences but may need different approach
    process.stderr.write(`\x1b]2;${title}\x07`);  // Window title
    process.stderr.write(`\x1b]0;${title}\x07`);  // Icon and window title

    // Try OSC 7 for Ghostty tab titles (some terminals use this)
    process.stderr.write(`\x1b]7;${title}\x07`);

    // Also try the standard xterm way with ST terminator
    process.stderr.write(`\x1b]2;${title}\x1b\\`);
  } else if (term.includes('kitty')) {
    // Kitty-specific sequences
    process.stderr.write(`\x1b]0;${title}\x07`);
    process.stderr.write(`\x1b]2;${title}\x07`);
    process.stderr.write(`\x1b]30;${title}\x07`);  // Kitty-specific
  } else {
    // Generic sequences for other terminals
    process.stderr.write(`\x1b]0;${title}\x07`);  // Icon and window
    process.stderr.write(`\x1b]2;${title}\x07`);  // Window title
  }

  // Flush stderr to ensure immediate output
  if (process.stderr.isTTY) {
    process.stderr.write('');
  }
}

// Single-voice system: Voice server uses default from .env
// No need to load voices.json

// Simple cleaner - just strip formatting
function cleanCompletedMessage(completedLine: string): string {
  return completedLine
    .replace(/\*+/g, '')
    .replace(/\[AGENT:\w+\]\s*/i, '')
    .replace(/\[.*?\]/g, '')
    .trim();
}

async function main() {
  // Log that hook was triggered
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok', hour12: false });
  const logFile = '/tmp/stop-hook-debug.log';

  // Write to log file that we can check later
  const fs = await import('fs');
  fs.appendFileSync(logFile, `\n${'='.repeat(80)}\n🎬 STOP-HOOK TRIGGERED AT ${timestamp}\n`);

  console.error(`\n🎬 STOP-HOOK TRIGGERED AT ${timestamp}`);

  // TEMPORARY: Output to stdout so Claude Code shows it
  console.log(`[STOP-HOOK-TEST] Hook executed at ${timestamp}`);
  console.error(`[STOP-HOOK-DEBUG] About to read stdin...`);

  // Get input
  let input = '';
  const decoder = new TextDecoder();
  const reader = Bun.stdin.stream().getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      input += decoder.decode(value, { stream: true });
    }
    console.error(`[STOP-HOOK-DEBUG] Finished reading stdin, got ${input.length} bytes`);
  } catch (e) {
    console.error(`❌ Error reading input: ${e}`);
    console.log(`[STOP-HOOK-ERROR] Failed to read stdin: ${e}`);
    process.exit(0);
  }

  if (!input) {
    console.error('❌ No input received');
    process.exit(0);
  }

  let transcriptPath;
  try {
    const parsed = JSON.parse(input);
    transcriptPath = parsed.transcript_path;
    console.error(`📁 Transcript path: ${transcriptPath}`);
  } catch (e) {
    console.error(`❌ Error parsing input JSON: ${e}`);
    process.exit(0);
  }

  if (!transcriptPath) {
    console.error('❌ No transcript_path in input');
    process.exit(0);
  }

  // Read the transcript
  let transcript;
  try {
    transcript = readFileSync(transcriptPath, 'utf-8');
    console.error(`📜 Transcript loaded: ${transcript.split('\n').length} lines`);
  } catch (e) {
    console.error(`❌ Error reading transcript: ${e}`);
    process.exit(0);
  }

  // Parse the JSON lines to find what happened in this session
  const lines = transcript.trim().split('\n');

  // Get the last user query for context
  let lastUserQuery = '';
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const entry = JSON.parse(lines[i]);
      if (entry.type === 'user' && entry.message?.content) {
        // Extract text from user message
        const content = entry.message.content;
        if (typeof content === 'string') {
          lastUserQuery = content;
        } else if (Array.isArray(content)) {
          for (const item of content) {
            if (item.type === 'text' && item.text) {
              lastUserQuery = item.text;
              break;
            }
          }
        }
        if (lastUserQuery) break;
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  // First, check if the LAST assistant message contains a Task tool or a COMPLETED line
  let isAgentTask = false;
  let taskResult = '';
  let agentType = '';

  // Find the last assistant message
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const entry = JSON.parse(lines[i]);

      if (entry.type === 'assistant' && entry.message?.content) {
        // Check if this assistant message contains a Task tool_use
        let foundTask = false;
        for (const content of entry.message.content) {
          if (content.type === 'tool_use' && content.name === 'Task') {
            // This is an agent task - find its result
            foundTask = true;
            agentType = content.input?.subagent_type || '';

            // Find the corresponding tool_result
            for (let j = i + 1; j < lines.length; j++) {
              const resultEntry = JSON.parse(lines[j]);
              if (resultEntry.type === 'user' && resultEntry.message?.content) {
                for (const resultContent of resultEntry.message.content) {
                  if (resultContent.type === 'tool_result' && resultContent.tool_use_id === content.id) {
                    taskResult = resultContent.content;
                    isAgentTask = true;
                    break;
                  }
                }
              }
              if (taskResult) break;
            }
            break;
          }
        }

        // We found the last assistant message, stop looking
        break;
      }
    } catch (e) {
      // Skip invalid JSON
    }
  }

  // Generate the announcement
  let message = '';
  let assistantHasCustomCompleted = false;

  // ALWAYS check assistant's response FIRST (even when agents are used)
  const lastResponse = lines[lines.length - 1];
  fs.appendFileSync(logFile, `\n📊 TRANSCRIPT ANALYSIS:\n`);
  fs.appendFileSync(logFile, `- Total lines: ${lines.length}\n`);
  fs.appendFileSync(logFile, `- Last user query: "${lastUserQuery}"\n`);

  try {
    const entry = JSON.parse(lastResponse);
    fs.appendFileSync(logFile, `- Last entry type: ${entry.type}\n`);

    if (entry.type === 'assistant' && entry.message?.content) {
      const content = entry.message.content.map(c => c.text || '').join(' ');

      // Log first and last 200 chars of content for debugging
      fs.appendFileSync(logFile, `- Content length: ${content.length} chars\n`);
      fs.appendFileSync(logFile, `- Content first 200 chars: "${content.substring(0, 200)}"\n`);
      fs.appendFileSync(logFile, `- Content last 200 chars: "${content.substring(content.length - 200)}"\n`);

      // First, look for CUSTOM COMPLETED line (voice-optimized)
      // Handle optional markdown formatting like **CUSTOM COMPLETED**
      const customCompletedMatch = content.match(/🗣️\s*\*{0,2}\s*CUSTOM\s+COMPLETED\s*\*{0,2}:\s*(.+?)(?:\n|$)/im);

      // DEBUG: Log what we matched
      fs.appendFileSync(logFile, `\n🔍 PATTERN MATCHING:\n`);
      if (customCompletedMatch) {
        fs.appendFileSync(logFile, `✅ CUSTOM COMPLETED match found: "${customCompletedMatch[1]}"\n`);
        fs.appendFileSync(logFile, `- Full match: "${customCompletedMatch[0]}"\n`);
      } else {
        fs.appendFileSync(logFile, `❌ No CUSTOM COMPLETED match\n`);

        // Check if the pattern exists at all
        if (content.includes('CUSTOM COMPLETED')) {
          fs.appendFileSync(logFile, `⚠️ WARNING: Found "CUSTOM COMPLETED" text but regex didn't match!\n`);
          const idx = content.indexOf('CUSTOM COMPLETED');
          fs.appendFileSync(logFile, `- Context around match: "${content.substring(Math.max(0, idx - 50), idx + 100)}"\n`);
        }
      }

      if (customCompletedMatch) {
        // Use CUSTOM COMPLETED directly - no word limit, no analysis
        message = cleanCompletedMessage(customCompletedMatch[1]);
        assistantHasCustomCompleted = true;
        console.error(`🗣️ ASSISTANT CUSTOM VOICE: ${message}`);
      } else if (!isAgentTask) {
        // No CUSTOM COMPLETED and no agent - look for regular COMPLETED line
        const completedMatch = content.match(/🎯\s*\*{0,2}\s*COMPLETED\s*\*{0,2}:\s*(.+?)(?:\n|$)/im);

        if (completedMatch) {
          // Use COMPLETED directly - no word limit, no analysis
          message = cleanCompletedMessage(completedMatch[1]);
          console.error(`🎯 ASSISTANT COMPLETED: ${message}`);
        } else {
          // No COMPLETED line found - don't send anything
          console.error('⚠️ No COMPLETED line found');
        }
      }
    }
  } catch (e) {
    console.error('⚠️ Error parsing assistant response:', e);
  }

  // If assistant didn't provide a CUSTOM COMPLETED and an agent was used, check agent's response
  if (!message && isAgentTask && taskResult) {
    // First, try to find CUSTOM COMPLETED line in agent response
    const customCompletedMatch = taskResult.match(/🗣️\s*\*{0,2}\s*CUSTOM\s+COMPLETED\s*\*{0,2}:\s*(.+?)(?:\n|$)/im);

    if (customCompletedMatch) {
      // Use CUSTOM COMPLETED directly - no word limit, no analysis
      message = cleanCompletedMessage(customCompletedMatch[1]);
      console.error(`🗣️ AGENT CUSTOM VOICE: ${message}`);
    } else {
      // No CUSTOM COMPLETED, look for regular COMPLETED line
      const completedMatch = taskResult.match(/🎯\s*\*{0,2}\s*COMPLETED\s*\*{0,2}:\s*(.+?)$/im);

      if (completedMatch) {
        // Use COMPLETED directly - no word limit, no analysis
        message = cleanCompletedMessage(completedMatch[1]);
        console.error(`🎯 AGENT COMPLETED: ${message}`);
      }
    }
  }

  // Send voice notification if we have a message
  if (message) {
    fs.appendFileSync(logFile, `📝 Sending voice: "${message}"\n`);

    try {
      await sendNotification({
        title: 'Task Complete',
        message: message,
        voiceEnabled: true
      });
      fs.appendFileSync(logFile, `✅ Voice sent\n`);
    } catch (error: any) {
      fs.appendFileSync(logFile, `❌ Voice error: ${error.message || error}\n`);
    }
  } else {
    fs.appendFileSync(logFile, `⚠️ No message\n`);
  }

  // ALWAYS set tab title to override any previous titles (like "dynamic requirements")
  // Generate a meaningful title even if we don't have a voice message
  let tabTitle = message || '';

  // If we don't have a message, generate a title from the last user query or completed task
  if (!tabTitle && lastUserQuery) {
    // Try to extract a completed line from the last assistant response
    try {
      const lastResponse = lines[lines.length - 1];
      const entry = JSON.parse(lastResponse);
      if (entry.type === 'assistant' && entry.message?.content) {
        const content = entry.message.content.map(c => c.text || '').join(' ');
        const completedMatch = content.match(/🎯\s*\*{0,2}\s*COMPLETED\s*\*{0,2}:\s*(.+?)(?:\n|$)/im);
        if (completedMatch) {
          tabTitle = completedMatch[1].trim()
            .replace(/\*+/g, '')
            .replace(/\[.*?\]/g, '')
            .trim();
        }
      }
    } catch (e) {}

    // Fall back to generating a title from the user query
    if (!tabTitle) {
      tabTitle = generateTabTitle(lastUserQuery, '');
    }
  }

  // Set tab title to override "dynamic requirements" or any other previous title
  if (tabTitle) {
    try {
      // Escape single quotes in the message to prevent shell injection
      const escapedTitle = tabTitle.replace(/'/g, "'\\''");

      // Use printf command to set the tab title - this works in Kitty
      const { execSync } = await import('child_process');
      execSync(`printf '\\033]0;${escapedTitle}\\007' >&2`);
      execSync(`printf '\\033]2;${escapedTitle}\\007' >&2`);
      execSync(`printf '\\033]30;${escapedTitle}\\007' >&2`);

      console.error(`\n🏷️ Tab title set to: "${tabTitle}"`);
    } catch (e) {
      console.error(`❌ Failed to set tab title: ${e}`);
    }
  }

  console.error(`📝 User query: ${lastUserQuery || 'No query found'}`);
  console.error(`✅ Message: ${message || 'No completion message'}`)

  // Final tab title override as the very last action - use the actual completion message
  if (message) {
    // Use the actual completion message as the tab title
    const finalTabTitle = message.slice(0, 50); // Limit to 50 chars for tab title
    process.stderr.write(`\033]2;${finalTabTitle}\007`);
  }

  console.error(`🎬 STOP-HOOK COMPLETED SUCCESSFULLY at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok', hour12: false })}\n`);
}

main().catch(() => {});