:root{
  --bg:#0A0D10;
  --panel:#12161B;
  --panel-raised:#161B21;
  --border:#232A32;
  --amber:#FFA630;
  --amber-dim:#B37627;
  --text:#E7ECF1;
  --muted:#8B95A1;
  --red:#E5484D;
  --green:#3FB950;
  --mono:'SF Mono','Consolas','Menlo',monospace;
  --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
}
*{box-sizing:border-box;}
body{
  margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);
  min-height:100vh;
}
.wrap{max-width:1100px;margin:0 auto;padding:32px 24px 60px;}

/* Mode banner */
.mode-banner{
  font-family:var(--mono);font-size:12px;padding:10px 16px;border-radius:6px;margin-bottom:18px;
  border:1px solid var(--border);
}
.mode-banner.demo{background:#1E1A0F;border-color:var(--amber-dim);color:var(--amber);}
.mode-banner.live{background:#0F1E14;border-color:#1F5C33;color:var(--green);}
.hidden{display:none !important;}

/* Header */
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.brand{font-family:var(--mono);font-size:13px;letter-spacing:.14em;color:var(--amber);text-transform:uppercase;}
.title{font-family:var(--mono);font-size:26px;font-weight:600;margin:4px 0 0;letter-spacing:-0.01em;}
.clock{font-family:var(--mono);font-size:12px;color:var(--muted);text-align:right;padding-top:4px;}

hr.sep{border:none;border-top:1px solid var(--border);margin:16px 0 24px;}

/* Command bar */
.cmdbar{
  display:flex;gap:0;background:var(--panel);border:1px solid var(--border);border-radius:6px;
  overflow:hidden;margin-bottom:8px;
}
.cmdbar .prompt{font-family:var(--mono);color:var(--amber);padding:14px 6px 14px 16px;font-size:15px;user-select:none;}
.cmdbar input{
  flex:1;background:transparent;border:none;color:var(--text);outline:none;
  font-family:var(--mono);font-size:15px;padding:14px 8px;
}
.cmdbar input::placeholder{color:var(--muted);}
.cmdbar button{
  background:var(--amber);color:#1A1200;border:none;font-family:var(--mono);font-weight:700;
  font-size:13px;letter-spacing:.06em;padding:0 28px;cursor:pointer;
}
.cmdbar button:hover{background:#ffb752;}
.cmdbar button:disabled{background:var(--muted);cursor:not-allowed;}
.hint{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:24px;}

/* Tabs */
.tabs{display:flex;gap:4px;margin-bottom:16px;border-bottom:1px solid var(--border);}
.tab-btn{
  background:transparent;border:none;color:var(--muted);font-family:var(--mono);font-size:12px;
  letter-spacing:.06em;text-transform:uppercase;padding:10px 18px;cursor:pointer;border-bottom:2px solid transparent;
}
.tab-btn.active{color:var(--amber);border-bottom-color:var(--amber);}
.tab-panel{display:none;}
.tab-panel.active{display:block;}

/* Pipeline status grid */
.pipeline-grid{
  border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-bottom:20px;background:var(--panel);
}
.pg-row{display:grid;grid-template-columns:1.4fr repeat(5,1fr);border-top:1px solid var(--border);}
.pg-row:first-child{border-top:none;background:var(--panel-raised);}
.pg-cell{padding:10px 8px;text-align:center;font-family:var(--mono);font-size:10.5px;color:var(--muted);border-left:1px solid var(--border);}
.pg-cell:first-child{border-left:none;text-align:left;color:var(--text);font-weight:600;}
.pg-row:first-child .pg-cell{text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600;}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--muted);}
.dot.running{background:var(--amber);animation:pulse 1s ease-in-out infinite;}
.dot.done{background:var(--green);}
.dot.error{background:var(--red);}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}

/* Error banner */
.error-banner{
  border:1px solid #5C2327;background:#1A0E0F;color:var(--red);font-family:var(--mono);font-size:13px;
  padding:14px 18px;border-radius:6px;margin-bottom:20px;
}

/* Results */
.company-card{
  border:1px solid var(--border);border-radius:6px;background:var(--panel);margin-bottom:20px;overflow:hidden;
}
.company-header{
  padding:14px 18px;background:var(--panel-raised);font-family:var(--mono);font-size:15px;font-weight:600;
  display:flex;justify-content:space-between;align-items:center;
}
.company-header .badge{
  font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border-radius:4px;
  font-family:var(--mono);font-weight:700;
}
.badge.demo{background:#1E1A0F;color:var(--amber);border:1px solid var(--amber-dim);}
.badge.live{background:#0F1E14;color:var(--green);border:1px solid #1F5C33;}
.agent-section{border-top:1px solid var(--border);}
.agent-section summary{
  padding:12px 18px;cursor:pointer;font-family:var(--mono);font-size:12.5px;color:var(--amber);
  text-transform:uppercase;letter-spacing:.05em;list-style:none;display:flex;align-items:center;gap:8px;
}
.agent-section summary::-webkit-details-marker{display:none;}
.agent-section summary::before{content:'▸';display:inline-block;transition:transform .15s;color:var(--muted);}
.agent-section[open] summary::before{transform:rotate(90deg);}
.agent-section .agent-body{
  padding:4px 18px 18px;font-size:13.5px;line-height:1.65;white-space:pre-wrap;color:var(--text);
}
.agent-section .agent-error{color:var(--red);font-family:var(--mono);font-size:12.5px;padding:0 18px 18px;}

/* History */
.history-list{border:1px solid var(--border);border-radius:6px;overflow:hidden;margin-bottom:20px;}
.history-row{
  display:flex;justify-content:space-between;align-items:center;padding:12px 16px;
  border-top:1px solid var(--border);font-family:var(--mono);font-size:12.5px;cursor:pointer;background:var(--panel);
}
.history-row:first-child{border-top:none;}
.history-row:hover{background:var(--panel-raised);}
.history-row .companies{color:var(--text);font-weight:600;}
.history-row .meta{color:var(--muted);display:flex;gap:12px;align-items:center;}
.history-empty{font-family:var(--mono);font-size:12.5px;color:var(--muted);padding:16px;}

/* Access gate */
#accessGate{
  position:fixed;inset:0;background:rgba(10,13,16,.92);z-index:999;
  display:none;align-items:center;justify-content:center;
}
#accessGate.visible{display:flex;}
.gate-card{
  background:var(--panel);border:1px solid var(--border);border-radius:8px;
  padding:28px;width:340px;max-width:90vw;font-family:var(--mono);
}
.gate-card h3{margin:0 0 6px;font-size:15px;color:var(--amber);letter-spacing:.06em;text-transform:uppercase;}
.gate-card p{margin:0 0 16px;font-size:12px;color:var(--muted);line-height:1.5;}
.gate-card input{
  width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);
  font-family:var(--mono);font-size:14px;padding:10px 12px;border-radius:5px;margin-bottom:10px;outline:none;
}
.gate-card input:focus{border-color:var(--amber);}
.gate-card button{
  width:100%;background:var(--amber);color:#1A1200;border:none;font-family:var(--mono);font-weight:700;
  font-size:13px;letter-spacing:.06em;padding:10px 0;cursor:pointer;text-transform:uppercase;border-radius:5px;
}
.gate-card .gate-err{color:var(--red);font-size:12px;margin:0 0 10px;min-height:14px;}

/* Footer */
.disclaimer{
  font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.6;margin-top:40px;
  padding-top:20px;border-top:1px solid var(--border);
}

@media (max-width:700px){
  .pg-row{grid-template-columns:1.2fr repeat(5,1fr);}
  .pg-cell{font-size:9px;padding:8px 4px;}
  .topbar{flex-direction:column;gap:8px;}
}
