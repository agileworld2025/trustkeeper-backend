/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'agileworldtechnologies007@gmail.com',
    pass: process.env.EMAIL_PASS || 'ofzv mikr szfv dgkn',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Generate secure sharing token
const generateSharingToken = () => crypto.randomBytes(32).toString('hex');

// Send basic document sharing email (for non-TrustKeeper sharing)
const sendDocumentSharingEmail = async (emailData) => {
  try {
    const {
      recipientEmail,
      recipientName,
      ownerName,
      documentType,
      documentName,
      sharingUrl,
      message,
      expiresAt,
    } = emailData;

    const documentTypeDisplay = documentType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'trustkeeper'}" <${emailConfig.auth.user}>`,
      to: recipientEmail,
      subject: `${ownerName} has shared a ${documentTypeDisplay} with you`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document Shared</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666;
            }
            .warning { 
              background: #fff3cd; 
              border: 1px solid #ffeaa7; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 15px 0;
            }
            .document-summary {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border-left: 4px solid #2196f3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📄 Document Shared with You</h2>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'there'},</p>
              
              <p><strong>${ownerName}</strong> has shared a <strong>${documentTypeDisplay}</strong> document with you.</p>
              
              ${message ? `<p><strong>Personal Message:</strong><br><em>"${message}"</em></p>` : ''}
              
              <div class="document-summary">
                <p><strong>📋 Document Summary:</strong> ${documentName || documentTypeDisplay}</p>
                <p><strong>🔗 Access Link:</strong> <a href="${sharingUrl}">Click here to view the full document</a></p>
              </div>
              
              <div style="text-align: center;">
                <a href="${sharingUrl}" class="button">View Full Document</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This document is shared with <strong>read-only access</strong></li>
                  <li>You cannot modify or delete the document</li>
                  <li>Keep this link secure and do not share it with others</li>
                  ${expiresAt ? `<li>This link will expire on: <strong>${new Date(expiresAt).toLocaleDateString()}</strong></li>` : ''}
                </ul>
              </div>
              
              <p>If you have any questions about this document, please contact ${ownerName} directly.</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by ${process.env.APP_NAME || 'trustkeeper'} on behalf of ${ownerName}.</p>
              <p>If you did not expect this email, please ignore it or contact the sender.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);

    return { success: false, error: error.message };
  }
};

// Send sharing notification to owner
const sendSharingNotificationToOwner = async (emailData) => {
  try {
    const {
      ownerEmail,
      ownerName,
      recipientEmail,
      recipientName,
      documentType,
      documentName,
    } = emailData;

    const documentTypeDisplay = documentType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'trustkeeper'}" <${emailConfig.auth.user}>`,
      to: ownerEmail,
      subject: `Document sharing confirmation: ${documentTypeDisplay}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sharing Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { padding: 20px; }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Document Sharing Confirmed</h2>
            </div>
            
            <div class="content">
              <p>Hello ${ownerName},</p>
              
              <p>Your <strong>${documentTypeDisplay}</strong> document has been successfully shared.</p>
              
              <p><strong>Shared with:</strong> ${recipientName || recipientEmail}</p>
              <p><strong>Document:</strong> ${documentName || documentTypeDisplay}</p>
              <p><strong>Access Level:</strong> Read-only</p>
              
              <p>The recipient will receive an email with a secure link to view the document.</p>
            </div>
            
            <div class="footer">
              <p>This is a confirmation email from ${process.env.APP_NAME || 'trustkeeper'}.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Owner notification sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending owner notification:', error);

    return { success: false, error: error.message };
  }
};

// Send app download email to non-users
const sendAppDownloadEmail = async (emailData) => {
  try {
    const {
      recipientEmail,
      ownerName,
      sharedAssetsCount,
      appDownloadUrl,
      appName,
    } = emailData;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'TrustKeeper'}" <${emailConfig.auth.user}>`,
      to: recipientEmail,
      subject: `${ownerName} has shared ${sharedAssetsCount} assets with you - Download TrustKeeper App`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Download TrustKeeper App</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px; 
              margin-bottom: 20px; 
              text-align: center; 
            }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 25px; 
              margin: 20px 10px;
              font-weight: 600;
              font-size: 16px;
            }
            .button:hover { background: #0056b3; }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666;
            }
            .feature-list {
              background: #e3f2fd;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin: 10px 0;
            }
            .feature-icon {
              font-size: 20px;
              margin-right: 10px;
            }
            .download-section {
              text-align: center;
              background: #f8f9fa;
              padding: 30px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .app-logo {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .store-buttons {
              margin: 20px 0;
            }
            .store-button {
              display: inline-block;
              margin: 10px;
              text-decoration: none;
            }
            .store-button img {
              height: 60px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="app-logo">📱</div>
              <h1>${appName || 'TrustKeeper'}</h1>
              <p>Secure Asset Management & Document Sharing</p>
            </div>
            
            <div class="content">
              <p>Hello there,</p>
              
              <p><strong>${ownerName}</strong> has shared <strong>${sharedAssetsCount} important assets</strong> with you through ${appName || 'TrustKeeper'}.</p>
              
              <div class="download-section">
                <h2>📱 Download the App to Access Your Shared Assets</h2>
                <p>To view and manage the assets shared with you, please download the ${appName || 'TrustKeeper'} app and create your account.</p>
                
                <div class="store-buttons">
                  <a href="${appDownloadUrl || 'https://play.google.com/store/apps/details?id=com.get.paisa'}" class="store-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play">
                  </a>
                  <a href="${appDownloadUrl || 'https://apps.apple.com/app/trustkeeper'}" class="store-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store">
                  </a>
                </div>
                
                <a href="${appDownloadUrl || 'https://trustkeeper.app'}" class="button">Download Now</a>
              </div>              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Download the ${appName || 'TrustKeeper'} app from the link above</li>
                <li>Create your account using this email address: <strong>${recipientEmail}</strong></li>
                <li>Access your shared assets in the "Shared Assets" section</li>
                <li>View and manage all documents securely</li>
              </ol>
            </div>
            
            <div class="footer">
              <p>This invitation was sent by ${ownerName} through ${appName || 'TrustKeeper'}.</p>
              <p>If you have any questions, please contact ${ownerName} directly.</p>
              <p>© 2024 ${appName || 'TrustKeeper'}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('App download email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send app download email error:', error);

    return { success: false, error: error.message };
  }
};

// Send simple app notification email (no document details)
const sendAppNotificationEmail = async (emailData) => {
  try {
    const {
      recipientEmail,
      recipientName,
      ownerName,
      appDeepLink,
      appName,
      message,
    } = emailData;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'TrustKeeper'}" <${emailConfig.auth.user}>`,
      to: recipientEmail,
      subject: `${ownerName} has shared assets with you in ${appName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Shared Assets</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px; 
              margin-bottom: 20px; 
              text-align: center; 
            }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 25px; 
              margin: 20px 0;
              font-weight: 600;
              font-size: 16px;
            }
            .button:hover { background: #0056b3; }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666;
            }
            .app-section {
              background: #e8f5e8;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
            }
            .app-logo {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .notification-box {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="app-logo">📱</div>
              <h1>New Shared Assets</h1>
              <p>You have received new shared assets in ${appName}</p>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'there'},</p>
              
              <p><strong>${ownerName}</strong> has shared new assets with you in the ${appName} app.</p>
              
              <div class="notification-box">
                <strong>📋 Notification:</strong><br>
                ${message || 'You have received new shared assets. Open the app to view details.'}
              </div>
              
              <div class="app-section">
                <div class="app-logo">📱</div>
                <h3>View in ${appName} App</h3>
                <p>Open the ${appName} app to view your shared assets and access all the details securely.</p>
                <a href="${appDeepLink}" class="button">Open in ${appName} App</a>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>🔒 Secure Access:</strong>
                <ul>
                  <li>All document details are securely stored in the app</li>
                  <li>Access your shared assets anytime, anywhere</li>
                  <li>Real-time notifications for new shares</li>
                  <li>Organized view of all your shared documents</li>
                </ul>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Open the ${appName} app on your device</li>
                <li>Navigate to the "Shared Assets" section</li>
                <li>View all your shared documents and details</li>
                <li>Access comprehensive information about each asset</li>
              </ol>
            </div>
            
            <div class="footer">
              <p>This notification was sent by ${appName} on behalf of ${ownerName}.</p>
              <p>For security reasons, document details are only available within the app.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('App notification email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send app notification email error:', error);

    return { success: false, error: error.message };
  }
};

// Send family member addition notification email
const sendFamilyMemberAdditionEmail = async (emailData) => {
  try {
    const {
      recipientEmail,
      recipientName,
      ownerName,
      familyMemberName,
      relationType,
      accessLevel,
      appName,
    } = emailData;

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'TrustKeeper'}" <${emailConfig.auth.user}>`,
      to: recipientEmail,
      subject: `${ownerName} has added you as a family member in ${appName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Family Member Added</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              border-radius: 8px; 
              margin-bottom: 20px; 
              text-align: center; 
            }
            .content { padding: 20px; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 15px 30px; 
              text-decoration: none; 
              border-radius: 25px; 
              margin: 20px 0;
              font-weight: 600;
              font-size: 16px;
            }
            .button:hover { background: #0056b3; }
            .footer { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 8px; 
              margin-top: 20px; 
              font-size: 12px; 
              color: #666;
            }
            .family-info {
              background: #e8f5e8;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #28a745;
            }
            .access-level {
              background: #e3f2fd;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border-left: 4px solid #2196f3;
            }
            .app-section {
              background: #fff3cd;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
              border: 1px solid #ffeaa7;
            }
            .app-logo {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="app-logo">👨‍👩‍👧‍👦</div>
              <h1>Family Member Added</h1>
              <p>You've been added as a family member in ${appName}</p>
            </div>
            
            <div class="content">
              <p>Hello ${recipientName || 'there'},</p>
              
              <p><strong>${ownerName}</strong> has added you as a family member in the ${appName} app.</p>
              
              <div class="family-info">
                <h3>👨‍👩‍👧‍👦 Family Member Details</h3>
                <p><strong>Your Name:</strong> ${familyMemberName || recipientName}</p>
                <p><strong>Relationship:</strong> ${relationType || 'Family Member'}</p>
                <p><strong>Added by:</strong> ${ownerName}</p>
              </div>
              
              <div class="access-level">
                <h3>🔐 Access Level</h3>
                <p><strong>Current Access:</strong> ${accessLevel || 'View Only'}</p>
                <p>You can view shared family assets and documents based on your access level.</p>
              </div>
              
              <div class="app-section">
                <div class="app-logo">📱</div>
                <h3>Get Started with ${appName}</h3>
                <p>Download the ${appName} app to access your family's shared assets and documents securely.</p>
                <a href="${process.env.APP_DOWNLOAD_URL || 'https://play.google.com/store/apps/details?id=com.get.paisa'}" class="button">Download ${appName} App</a>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>🔒 What you can do:</strong>
                <ul>
                  <li>View shared family assets and documents</li>
                  <li>Access important family information securely</li>
                  <li>Stay updated with family notifications</li>
                  <li>Manage your family profile</li>
                </ul>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Download the ${appName} app using the link above</li>
                <li>Create your account using this email address: <strong>${recipientEmail}</strong></li>
                <li>Access your family's shared assets in the app</li>
                <li>Start collaborating with your family members</li>
              </ol>
            </div>
            
            <div class="footer">
              <p>This invitation was sent by ${ownerName} through ${appName}.</p>
              <p>If you have any questions, please contact ${ownerName} directly.</p>
              <p>© 2024 ${appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Family member addition email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Send family member addition email error:', error);

    return { success: false, error: error.message };
  }
};

module.exports = {
  generateSharingToken,
  sendDocumentSharingEmail,
  sendSharingNotificationToOwner,
  sendAppDownloadEmail,
  sendAppNotificationEmail,
  sendFamilyMemberAdditionEmail,
  transporter,
};
