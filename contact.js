import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, budget, zone, moveInDate, duration } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and email are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Beautiful HTML email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      background: #000; 
      color: #fff; 
      padding: 40px 20px; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
      border-radius: 20px; 
      padding: 40px; 
      border: 1px solid #333;
      box-shadow: 0 20px 60px rgba(255, 215, 0, 0.15);
    }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { 
      font-size: 56px; 
      font-weight: 900; 
      background: linear-gradient(135deg, #FFD700, #FFA500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
      letter-spacing: 2px;
    }
    .badge { 
      display: inline-block;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #000;
      padding: 10px 24px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .section { margin-bottom: 24px; }
    .label { 
      color: #888; 
      font-size: 11px; 
      text-transform: uppercase; 
      letter-spacing: 2px; 
      margin-bottom: 10px; 
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .value { 
      color: #fff; 
      font-size: 18px; 
      padding: 16px 20px; 
      background: rgba(255, 215, 0, 0.05); 
      border-left: 4px solid #FFD700; 
      border-radius: 8px;
      word-wrap: break-word;
    }
    .value a { 
      color: #FFD700; 
      text-decoration: none; 
      font-weight: 600;
      transition: all 0.2s;
    }
    .value a:hover { 
      text-decoration: underline; 
      color: #FFA500;
    }
    .message-box { 
      background: rgba(0, 0, 0, 0.4); 
      border: 1px solid #333; 
      border-radius: 12px; 
      padding: 24px; 
      color: #ddd; 
      font-size: 16px; 
      line-height: 1.8;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .footer { 
      margin-top: 40px; 
      padding-top: 24px; 
      border-top: 1px solid #333; 
      text-align: center; 
      color: #666; 
      font-size: 13px;
    }
    .timestamp { 
      color: #888; 
      margin-bottom: 16px;
      font-size: 14px;
    }
    .action-required {
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid rgba(255, 215, 0, 0.3);
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }
    .action-required strong {
      color: #FFD700;
      font-size: 15px;
    }
    .highlight {
      background: rgba(255, 215, 0, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
      color: #FFD700;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BOOM</div>
      <div class="badge">🔥 NEW LEAD</div>
    </div>
    
    <div class="section">
      <div class="label">👤 NOME</div>
      <div class="value">${name}</div>
    </div>
    
    <div class="section">
      <div class="label">✉️ EMAIL</div>
      <div class="value">
        <a href="mailto:${email}">${email}</a>
      </div>
    </div>
    
    ${phone ? `
      <div class="section">
        <div class="label">📱 TELEFONO</div>
        <div class="value">
          <a href="tel:${phone}">${phone}</a>
        </div>
      </div>
    ` : ''}
    
    ${budget ? `
      <div class="section">
        <div class="label">💰 BUDGET</div>
        <div class="value">${budget}</div>
      </div>
    ` : ''}
    
    ${zone ? `
      <div class="section">
        <div class="label">📍 ZONA PREFERITA</div>
        <div class="value">${zone}</div>
      </div>
    ` : ''}
    
    ${moveInDate ? `
      <div class="section">
        <div class="label">📅 DATA INGRESSO</div>
        <div class="value">${moveInDate}</div>
      </div>
    ` : ''}
    
    ${duration ? `
      <div class="section">
        <div class="label">⏱️ DURATA</div>
        <div class="value">${duration} mesi</div>
      </div>
    ` : ''}
    
    ${message ? `
      <div class="section">
        <div class="label">💬 MESSAGGIO</div>
        <div class="message-box">${message}</div>
      </div>
    ` : ''}
    
    <div class="footer">
      <div class="timestamp">
        📅 Ricevuto: ${new Date().toLocaleString('it-IT', { 
          timeZone: 'Europe/Rome',
          dateStyle: 'full',
          timeStyle: 'short'
        })}
      </div>
      <div class="action-required">
        <strong>⚡ AZIONE RICHIESTA</strong>
        <br>
        Rispondi entro <span class="highlight">24 ore</span> per massimizzare la conversione
      </div>
    </div>
  </div>
</body>
</html>`;

    // Plain text fallback
    const textContent = `
🔥 NUOVO LEAD - BOOM

Nome: ${name}
Email: ${email}
${phone ? `Telefono: ${phone}` : ''}
${budget ? `Budget: ${budget}` : ''}
${zone ? `Zona: ${zone}` : ''}
${moveInDate ? `Data ingresso: ${moveInDate}` : ''}
${duration ? `Durata: ${duration} mesi` : ''}

${message ? `Messaggio:\n${message}` : ''}

---
Ricevuto: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
⚡ Rispondi entro 24 ore per massimizzare la conversione
`;

    // Send email via Resend
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `🔥 BOOM: Nuovo contatto da ${name}`,
      html: htmlContent,
      text: textContent,
    });

    console.log('Email sent successfully:', result);

    return res.status(200).json({
      success: true,
      message: 'Grazie! Ti contatteremo entro 24 ore.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Si è verificato un errore. Riprova o scrivici direttamente.'
    });
  }
}
