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

export async function getEventsForMonth(
  accessToken: string,
  year: number,
  month: number, // 1-indexed
): Promise<CalendarEvent[]> {
  const auth = getOAuth2Client(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })

  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 1)

  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startOfMonth.toISOString(),
    timeMax: endOfMonth.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
  })

  return (res.data.items ?? []).map((item) => ({
    id: item.id ?? crypto.randomUUID(),
    title: item.summary ?? '(No title)',
    start: item.start?.dateTime ?? item.start?.date ?? '',
    end: item.end?.dateTime ?? item.end?.date ?? '',
    color: item.colorId ?? undefined,
  }))
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string,
): Promise<void> {
  const auth = getOAuth2Client(accessToken)
  const calendar = google.calendar({ version: 'v3', auth })
  await calendar.events.delete({ calendarId: 'primary', eventId })
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
      colorId: '9',
      description: 'Created by Pomodoro Focus',
    },
  })

  return res.data.id ?? ''
}
