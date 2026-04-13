export function buildRoastEmail(ideaTitle: string, personaEmoji: string, personaName: string, content: string): string {
  const excerpt = content.split('\n\n---\n')[0].trim()
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:0 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:32px;">🔥</span>
      <h1 style="color:#00FF88;font-size:22px;font-weight:400;margin:8px 0 0;">RoastMePal</h1>
    </div>
    <div style="background:#13131A;border:1px solid #1F1F2E;border-radius:12px;padding:28px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <span style="font-size:28px;">${personaEmoji}</span>
        <div>
          <p style="color:#00FF88;font-size:13px;font-weight:600;margin:0;">${personaName}</p>
          <p style="color:#6B7280;font-size:12px;margin:2px 0 0;">roasting &ldquo;${ideaTitle}&rdquo;</p>
        </div>
      </div>
      <div style="border-top:1px solid #1F1F2E;padding-top:16px;">
        <p style="color:#E5E7EB;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${excerpt}</p>
      </div>
    </div>
    <p style="color:#4B5563;font-size:12px;text-align:center;margin-top:24px;">
      RoastMePal · All roasts fictional · <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color:#4B5563;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`
}
