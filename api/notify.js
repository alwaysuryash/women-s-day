const { Resend } = require('resend');

module.exports = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { event } = req.body;

  if (!event) {
    return res.status(400).json({ error: 'Event not specified' });
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
  let subject = '';
  let htmlBody = '';

  switch (event) {
    case 'link_opened':
      subject = '💖 Link Opened: A Special Visit';
      htmlBody = `<p>Bhanu opened the special link at <strong>${timestamp}</strong> (UTC).</p>`;
      break;
    case 'photos_viewed':
      subject = '📸 Photos Viewed: She Saw the Gallery!';
      htmlBody = `<p>Bhanu viewed the photo gallery at <strong>${timestamp}</strong> (UTC).</p>`;
      break;
    case 'letter_read':
      subject = '💌 Letter Read: She Opened Your Heartfelt Message';
      htmlBody = `<p>Bhanu read your letter at <strong>${timestamp}</strong> (UTC).</p>`;
      break;
    default:
      return res.status(400).json({ error: 'Invalid event type' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // This must be a verified domain in Resend
      to: process.env.NOTIFICATION_EMAIL, // Your email address
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff758c;">${subject}</h2>
          ${htmlBody}
          <p>This is an automated notification from your Women's Day website.</p>
        </div>
      `,
    });
    res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    console.error('Resend Error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};
