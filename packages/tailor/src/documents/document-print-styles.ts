/** Shared print/document styles aligned with BusinessOS design prototype. */
export const DOCUMENT_PRINT_FONTS = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

export const DOCUMENT_PRINT_BASE_CSS = `
  :root {
    --ink: #0e1a36;
    --accent: #ff6a2b;
    --ready: #12a36a;
    --urgent: #e5484d;
    --muted: #888;
    --line: #ddd;
    --line-soft: #eee;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    line-height: 1.5;
    color: #111;
    background: #fff;
    padding: 40px 44px;
    max-width: 780px;
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
  }
  .dhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 16px;
    margin-bottom: 20px;
  }
  .dbrand {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.15;
  }
  .dbrand small {
    display: block;
    font-size: 11px;
    color: #777;
    font-weight: 400;
    letter-spacing: 0.04em;
    margin-top: 4px;
    text-transform: uppercase;
  }
  .dbrand .shop-detail {
    display: block;
    font-size: 11px;
    color: #777;
    font-weight: 400;
    margin-top: 4px;
    line-height: 1.45;
    text-transform: none;
    letter-spacing: normal;
  }
  .dright {
    text-align: right;
    font-size: 11.5px;
    color: #555;
    line-height: 1.55;
  }
  .dtitle {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin-bottom: 14px;
  }
  .meta-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 14px;
  }
  .meta-block .k {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }
  .meta-block .v {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 15px;
    color: #111;
  }
  .meta-block .s {
    font-size: 12px;
    color: #555;
    margin-top: 2px;
  }
  .meta-block.right { text-align: right; }
  table.doc-table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 16px;
    table-layout: fixed;
  }
  table.doc-table th:nth-child(1),
  table.doc-table td:nth-child(1) { width: 26%; }
  table.doc-table th:nth-child(2),
  table.doc-table td:nth-child(2) { width: 26%; }
  table.doc-table th:nth-child(3),
  table.doc-table td:nth-child(3) { width: 12%; }
  table.doc-table th:nth-child(4),
  table.doc-table td:nth-child(4) { width: 18%; }
  table.doc-table th:nth-child(5),
  table.doc-table td:nth-child(5) { width: 18%; }
  table.doc-table th {
    text-align: left;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
    border-bottom: 1px solid var(--line);
    padding: 8px 6px;
    font-weight: 600;
  }
  table.doc-table th.num { text-align: right; }
  table.doc-table td {
    padding: 9px 6px;
    border-bottom: 1px solid var(--line-soft);
    font-size: 12.5px;
    vertical-align: top;
  }
  table.doc-table td.num { text-align: right; white-space: nowrap; }
  table.doc-table td b { font-weight: 600; }
  .drow {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 12.5px;
  }
  .dk { color: var(--muted); }
  .totbox {
    margin-top: 10px;
    border-top: 2px solid var(--ink);
    padding-top: 10px;
  }
  .tot {
    display: flex;
    justify-content: space-between;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: var(--ink);
  }
  .dates-line {
    margin-top: 16px;
    font-size: 12px;
    color: #333;
  }
  .dates-line .date-item + .date-item {
    margin-top: 4px;
  }
  .dates-line b { font-weight: 600; }
  .rush {
    color: var(--urgent);
    font-weight: 700;
    margin-left: 8px;
  }
  .dfoot {
    margin-top: 24px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    font-size: 11px;
    color: var(--muted);
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
  .msection { margin-bottom: 14px; }
  .msection:last-child { margin-bottom: 0; }
  .msection-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #0e1a36;
    margin-bottom: 6px;
  }
  .mgrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    border: 1px solid var(--line);
    border-radius: 6px;
    overflow: hidden;
  }
  .mcell {
    padding: 11px 13px;
    border-right: 1px solid var(--line-soft);
    border-bottom: 1px solid var(--line-soft);
  }
  .mcell:nth-child(3n) { border-right: none; }
  .mcell:nth-last-child(-n+3) { border-bottom: none; }
  .mcell .l {
    font-size: 10px;
    color: #0e1a36;
    text-transform: none;
    letter-spacing: 0.01em;
    font-weight: 600;
    line-height: 1.35;
  }
  .mcell .v {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 17px;
    margin-top: 3px;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }
  .mblank {
    height: 26px;
    border-bottom: 1px solid #bbb;
    margin-top: 6px;
  }
  .units-note {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .notes-label {
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .notes-box {
    border: 1px solid var(--line);
    border-radius: 6px;
    min-height: 60px;
    padding: 12px 14px;
    background: #fafafa;
    font-size: 12.5px;
    color: #333;
    white-space: pre-wrap;
  }
  .stamp {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    gap: 30px;
  }
  .stamp .sig {
    flex: 1;
    text-align: center;
    font-size: 11px;
    color: var(--muted);
    border-top: 1px solid #999;
    padding-top: 6px;
  }
  @media print {
    body { padding: 24px; }
  }
`;
