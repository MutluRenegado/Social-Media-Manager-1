'use client';
import React, { useState } from 'react';

export default function SocialMediaAssistantLite() {
  const [text, setText] = useState('');
  const [draft, setDraft] = useState('');
  const [tone, setTone] = useState<'Friendly'|'Bold'|'Formal'>('Friendly');
  const [brevity, setBrevity] = useState(50);
  const [platforms, setPlatforms] = useState<string[]>(['instagram','tiktok']);
  const [runAtISO, setRunAtISO] = useState('');

  async function generate() {
    const res = await fetch('/api/ai/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tone, brevity }),
    });
    const data = await res.json();
    if (data.ok) setDraft(data.drafted);
  }

  async function schedule() {
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post: { text: draft || text, hashtags: [] }, platforms, runAtISO, timezone: 'Europe/London' }),
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ display:'grid', gap:12, maxWidth:720 }}>
      <h2>Assistant (Lite)</h2>
      <textarea rows={8} value={text} onChange={e=>setText(e.target.value)} placeholder="Write something..." />
      <div>
        <label>Tone:</label>
        <select value={tone} onChange={e=>setTone(e.target.value as any)}>
          <option>Friendly</option><option>Bold</option><option>Formal</option>
        </select>
        <label style={{ marginLeft:8 }}>Brevity {brevity}</label>
        <input type="range" min={20} max={100} step={5} value={brevity} onChange={e=>setBrevity(parseInt(e.target.value))} />
        <button onClick={generate}>AI Draft</button>
      </div>
      <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:8 }}>{draft}</pre>
      <div>
        <label>Run At (ISO):</label>
        <input value={runAtISO} onChange={e=>setRunAtISO(e.target.value)} placeholder="2025-08-21T18:30:00.000Z" />
        <button onClick={schedule}>Schedule</button>
      </div>
    </div>
  );
}
