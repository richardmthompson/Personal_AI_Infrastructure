#!/usr/bin/env bun
/**
 * PAI Notifications Library
 *
 * Centralized notification system for PAI hooks.
 * Handles voice notifications via the PAI voice server.
 *
 * Environment Variables:
 * - ELEVENLABS_VOICE_ID: Default voice ID for notifications (REQUIRED)
 * - PAI_VOICE_SERVER_PORT: Port for voice server (default: 9999)
 */

import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';

interface NotificationOptions {
  title: string;
  message: string;
  voiceEnabled?: boolean;
  voiceId?: string | null;
  priority?: 'low' | 'normal' | 'high';
}

/**
 * Load environment variables from .env file (synchronous)
 */
function loadEnvVars(): Record<string, string> {
  const paiDir = process.env.PAI_DIR || join(homedir(), '.claude');
  const envPath = join(paiDir, '.env');
  const envVars: Record<string, string> = {};

  if (existsSync(envPath)) {
    try {
      const { readFileSync } = require('fs');
      const envContent = readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      });
    } catch (error) {
      // Silently fail if env file can't be read
    }
  }

  return envVars;
}

/**
 * Get the voice server port from environment
 */
function getVoiceServerPort(): number {
  const envVars = loadEnvVars();
  const port = process.env.PAI_VOICE_SERVER_PORT ||
               envVars.PORT ||
               process.env.PORT ||
               '9999';
  return parseInt(port);
}

/**
 * Get the default voice ID from environment
 * Throws an error if ELEVENLABS_VOICE_ID is not set
 */
function getDefaultVoiceId(): string {
  const envVars = loadEnvVars();
  // Only use .env file, ignore process.env (it may have stale values)
  const voiceId = envVars.ELEVENLABS_VOICE_ID;

  if (!voiceId) {
    console.error('❌ ERROR: ELEVENLABS_VOICE_ID not set in .env file');
    console.error('Please add ELEVENLABS_VOICE_ID to /Users/richardthompson/CODE/PAI/.claude/.env');
    process.exit(1);
  }

  return voiceId;
}

/**
 * Send a notification with optional voice
 *
 * @param options Notification options
 * @returns Promise that resolves when notification is sent (or fails silently)
 */
export async function sendNotification(options: NotificationOptions): Promise<void> {
  const {
    title,
    message,
    voiceEnabled = true,
    voiceId = null,
    priority = 'normal'
  } = options;

  try {
    const port = getVoiceServerPort();
    const defaultVoiceId = getDefaultVoiceId();
    const finalVoiceId = voiceId || defaultVoiceId;

    // DEBUG: Log what we're sending
    const debugLogFile = '/tmp/pai-notifications-debug.log';
    const { appendFileSync } = require('fs');
    appendFileSync(debugLogFile, `\n=== ${new Date().toISOString()} ===\n`);
    appendFileSync(debugLogFile, `Message: "${message}"\n`);
    appendFileSync(debugLogFile, `Provided voiceId: ${voiceId || 'null'}\n`);
    appendFileSync(debugLogFile, `Default voiceId: ${defaultVoiceId}\n`);
    appendFileSync(debugLogFile, `Final voiceId: ${finalVoiceId}\n`);
    appendFileSync(debugLogFile, `process.env.ELEVENLABS_VOICE_ID: ${process.env.ELEVENLABS_VOICE_ID || 'NOT SET'}\n`);
    appendFileSync(debugLogFile, `process.env.PAI_DIR: ${process.env.PAI_DIR || 'NOT SET'}\n`);

    const response = await fetch(`http://localhost:${port}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        message,
        voice_enabled: voiceEnabled,
        voice_id: finalVoiceId,
        priority,
      }),
    });

    if (!response.ok) {
      console.error(`Notification failed: ${response.status}`);
      appendFileSync(debugLogFile, `ERROR: HTTP ${response.status}\n`);
    } else {
      appendFileSync(debugLogFile, `SUCCESS\n`);
    }
  } catch (error) {
    // Silently fail if voice server isn't running
    // This allows hooks to work even when voice server is down
  }
}

/**
 * Send a PAI-specific notification (uses /pai endpoint)
 *
 * @param title Notification title
 * @param message Notification message
 * @returns Promise that resolves when notification is sent (or fails silently)
 */
export async function sendPAINotification(title: string, message: string): Promise<void> {
  try {
    const port = getVoiceServerPort();

    const response = await fetch(`http://localhost:${port}/pai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        message,
      }),
    });

    if (!response.ok) {
      console.error(`PAI notification failed: ${response.status}`);
    }
  } catch (error) {
    // Silently fail if voice server isn't running
  }
}

/**
 * Check if voice server is running
 *
 * @returns Promise that resolves to true if server is healthy
 */
export async function isVoiceServerHealthy(): Promise<boolean> {
  try {
    const port = getVoiceServerPort();
    const response = await fetch(`http://localhost:${port}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
