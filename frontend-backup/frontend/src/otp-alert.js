// This shows OTP in a nice popup
export function showOTPAlert(otp, maskedEmail, previewUrl) {
  const alertDiv = document.createElement('div');
  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.5s ease-out;
  `;
  
  let html = `<h3 style="margin: 0 0 10px 0;">📧 OTP Code</h3>`;
  html += `<p style="margin: 0 0 15px 0; font-size: 14px;">For: ${maskedEmail}</p>`;
  html += `<div style="text-align: center; margin: 15px 0;">`;
  html += `<div style="font-size: 36px; font-weight: bold; letter-spacing: 5px; background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px;">${otp}</div>`;
  html += `</div>`;
  
  if (previewUrl) {
    html += `<p style="font-size: 12px; margin: 10px 0;">`;
    html += `<a href="${previewUrl}" target="_blank" style="color: #ffcc00;">Click here to view test email</a>`;
    html += `</p>`;
  }
  
  html += `<p style="font-size: 12px; margin: 10px 0 0 0; opacity: 0.8;">This OTP is valid for 10 minutes</p>`;
  
  alertDiv.innerHTML = html;
  document.body.appendChild(alertDiv);
  
  // Auto-remove after 30 seconds
  setTimeout(() => {
    alertDiv.style.animation = 'slideOut 0.5s ease-out';
    setTimeout(() => alertDiv.remove(), 500);
  }, 30000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);
