import { google } from 'googleapis'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  color?: string
}

export interface StudyBlockOpts {
  title: string
  startTime: string // ISO 8601
  durationMinutes: number
}

function getOAuth2Client(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return auth
}

export async function getTodaysEvents(accessToken: string): Promise<CalendarEvent[]> {
  const auth = getOAuth2Client(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 20,
  })

  return (res.data.items ?? []).map((item) => ({
    id: item.id ?? crypto.randomUUID(),
    title: item.summary ?? '(No title)',
    start: item.start?.dateTime ?? item.start?.date ?? '',
    end: item.end?.dateTime ?? item.end?.date ?? '',
    color: item.colorId ?? undefined,
  }))
}

export async function createStudyBlock(
  accessToken: string,
  opts: StudyBlockOpts,
): Promise<string> {
  const auth = getOAuth2Client(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  const start = new Date(opts.startTime)
  const end = new Date(start.getTime() + opts.durationMinutes * 60_000)

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: opts.title,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      colorId: '9', // blueberry — distinct from other events
      description: 'Created by Pomodoro Focus',
    },
  })

  return res.data.id ?? ''
}
