import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Udant Martand</title>
    <link>https://udantmartand.com</link>
    <description>India's Heritage in Print &amp; Digital. Est. 1826.</description>
    <language>en-in</language>
    <item>
      <title>200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार</title>
      <link>https://udantmartand.com/news/bengal-hindi-200-years</link>
      <description>30 मई 1826 को कलकत्ता की सड़कों से शुरू हुआ 'उदन्त मार्तण्ड' का सफर, आज दो सदी बाद बंगाल की सांस्कृतिक रगों में हिंदी बनकर दौड़ रहा है।</description>
      <pubDate>Sat, 30 May 2026 00:00:00 +0000</pubDate>
    </item>
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
