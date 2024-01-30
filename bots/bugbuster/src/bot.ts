import { z } from 'zod'
import * as bp from '.botpress'

const github = new bp.github.Github()
const linear = new bp.linear.Linear()
const slack = new bp.slack.Slack()

export type Bot = typeof bot
export type EventHandler = Parameters<Bot['event']>[0]
export type EventHandlerProps = Parameters<EventHandler>[0]
export type BotEvents = {
  [K in EventHandlerProps['event']['type']]: Extract<EventHandlerProps['event'], { type: K }>
}

export const bot = new bp.Bot({
  integrations: {
    github,
    linear,
    slack,
  },
  configuration: {
    schema: z.object({
      ownerSlackId: z.string().optional(),
    }),
  },
  states: {},
  events: {
    syncIssuesRequest: {
      schema: z.object({}),
    },
  },
  recurringEvents: {
    fetchIssues: {
      type: 'syncIssuesRequest',
      payload: {},
      schedule: { cron: '0 0/6 * * *' }, // every 6 hours
    },
  },
})