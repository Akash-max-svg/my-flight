import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a modern, trendy flight ticket PDF
 */
export const generateTicketPDF = async (booking, confirmationData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 0,
        bufferPages: true
      });
      
      const chunks = [];
      
      // Collect PDF data
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Modern gradient background
      doc.rect(0, 0, 595, 842).fill('#f8f9fa');
      
      // Header with gradient
      const gradient = doc.linearGradient(0, 0, 595, 150);
      gradient.stop(0, '#667eea').stop(1, '#764ba2');
      doc.rect(0, 0, 595, 150).fill(gradient);
      
      // Logo/Title
      doc.fontSize(32)
         .fillColor('#ffffff')
         .font('Helvetica-Bold')
         .text('✈️ E-TICKET', 50, 40);
      
      doc.fontSize(14)
         .fillColor('#ffffff')
         .font('Helvetica')
         .text('Business Flight Direct', 50, 85);
      
      // Confirmation number box (top right)
      doc.roundedRect(380, 30, 180, 90, 10)
         .fillAndStroke('#ffffff', '#667eea');
      
      doc.fontSize(10)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('CONFIRMATION', 390, 45);
      
      doc.fontSize(18)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(confirmationData.confirmationNumber, 390, 65, { width: 160, align: 'center' });
      
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text(`E-Ticket: ${confirmationData.eTicketNumber}`, 390, 95, { width: 160, align: 'center' });
      
      // Main content area
      let yPos = 180;
      
      // Passenger Information Card
      doc.roundedRect(40, yPos, 515, 120, 10)
         .fillAndStroke('#ffffff', '#e0e0e0');
      
      doc.fontSize(14)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('👤 PASSENGER INFORMATION', 60, yPos + 20);
      
      yPos += 50;
      
      booking.passengers.forEach((passenger, index) => {
        if (index > 0) yPos += 25;
        
        doc.fontSize(11)
           .fillColor('#000000')
           .font('Helvetica-Bold')
           .text(`${passenger.firstName} ${passenger.lastName}`, 60, yPos);
        
        doc.fontSize(9)
           .fillColor('#666666')
           .font('Helvetica')
           .text(`Age: ${passenger.age} | Gender: ${passenger.gender}`, 60, yPos + 15);
        
        if (passenger.seatNumber) {
          doc.fontSize(9)
             .fillColor('#667eea')
             .font('Helvetica-Bold')
             .text(`Seat: ${passenger.seatNumber}`, 300, yPos);
        }
      });
      
      yPos += 60;
      
      // Flight Details Card
      doc.roundedRect(40, yPos, 515, 200, 10)
         .fillAndStroke('#ffffff', '#e0e0e0');
      
      doc.fontSize(14)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('✈️ FLIGHT DETAILS', 60, yPos + 20);
      
      yPos += 50;
      
      // Departure and Arrival boxes
      const boxWidth = 220;
      const boxSpacing = 275;
      
      // Departure box
      doc.roundedRect(60, yPos, boxWidth, 100, 8)
         .fillAndStroke('#f0f4ff', '#667eea');
      
      doc.fontSize(10)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('DEPARTURE', 70, yPos + 10);
      
      doc.fontSize(24)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.from, 70, yPos + 30);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text(new Date(booking.flight.departureDate || booking.bookingDate).toLocaleDateString('en-IN', {
           day: '2-digit',
           month: 'short',
           year: 'numeric'
         }), 70, yPos + 65);
      
      doc.fontSize(14)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.departure, 70, yPos + 80);
      
      // Arrow
      doc.fontSize(20)
         .fillColor('#667eea')
         .text('→', 290, yPos + 45);
      
      // Arrival box
      doc.roundedRect(boxSpacing + 60, yPos, boxWidth, 100, 8)
         .fillAndStroke('#f0f4ff', '#667eea');
      
      doc.fontSize(10)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('ARRIVAL', boxSpacing + 70, yPos + 10);
      
      doc.fontSize(24)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.to, boxSpacing + 70, yPos + 30);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text(new Date(booking.flight.arrivalDate || booking.bookingDate).toLocaleDateString('en-IN', {
           day: '2-digit',
           month: 'short',
           year: 'numeric'
         }), boxSpacing + 70, yPos + 65);
      
      doc.fontSize(14)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.arrival, boxSpacing + 70, yPos + 80);
      
      yPos += 130;
      
      // Flight info row
      const infoY = yPos;
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Airline:', 60, infoY);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.airline, 60, infoY + 12);
      
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Aircraft:', 200, infoY);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.aircraft || 'N/A', 200, infoY + 12);
      
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Class:', 340, infoY);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.class, 340, infoY + 12);
      
      doc.fontSize(9)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Duration:', 450, infoY);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.flight.time || booking.flight.duration || 'N/A', 450, infoY + 12);
      
      yPos += 60;
      
      // Booking Details Card
      doc.roundedRect(40, yPos, 515, 100, 10)
         .fillAndStroke('#ffffff', '#e0e0e0');
      
      doc.fontSize(14)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('💰 BOOKING DETAILS', 60, yPos + 20);
      
      yPos += 50;
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Booking ID:', 60, yPos);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(booking.bookingId, 150, yPos);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Booking Date:', 320, yPos);
      
      doc.fontSize(10)
         .fillColor('#000000')
         .font('Helvetica-Bold')
         .text(new Date(booking.bookingDate).toLocaleDateString('en-IN'), 420, yPos);
      
      yPos += 25;
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Total Amount:', 60, yPos);
      
      doc.fontSize(14)
         .fillColor('#28a745')
         .font('Helvetica-Bold')
         .text(`₹${booking.totalPrice?.toLocaleString('en-IN')}`, 150, yPos - 2);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .font('Helvetica')
         .text('Status:', 320, yPos);
      
      doc.fontSize(10)
         .fillColor('#28a745')
         .font('Helvetica-Bold')
         .text('CONFIRMED', 420, yPos);
      
      yPos += 50;
      
      // Important Information
      doc.roundedRect(40, yPos, 515, 80, 10)
         .fillAndStroke('#fff3cd', '#ffc107');
      
      doc.fontSize(12)
         .fillColor('#856404')
         .font('Helvetica-Bold')
         .text('⚠️ IMPORTANT INFORMATION', 60, yPos + 15);
      
      doc.fontSize(8)
         .fillColor('#856404')
         .font('Helvetica')
         .text('• Arrive at airport 2-3 hours before departure', 60, yPos + 35)
         .text('• Carry valid government-issued photo ID', 60, yPos + 47)
         .text('• Complete web check-in 24 hours before departure', 60, yPos + 59);
      
      doc.fontSize(8)
         .fillColor('#856404')
         .font('Helvetica')
         .text('• Review baggage allowance and restrictions', 310, yPos + 35)
         .text('• Keep this e-ticket for airport check-in', 310, yPos + 47)
         .text('• Contact support for any queries', 310, yPos + 59);
      
      // Footer
      yPos = 780;
      doc.fontSize(8)
         .fillColor('#999999')
         .font('Helvetica')
         .text('This is a computer-generated e-ticket and does not require a signature.', 50, yPos, { 
           width: 495, 
           align: 'center' 
         });
      
      doc.fontSize(8)
         .fillColor('#999999')
         .text(`Generated on ${new Date().toLocaleString('en-IN')}`, 50, yPos + 15, { 
           width: 495, 
           align: 'center' 
         });
      
      doc.fontSize(8)
         .fillColor('#667eea')
         .font('Helvetica-Bold')
         .text('Business Flight Direct | support@akgroup.com | +91-6301616095', 50, yPos + 30, { 
           width: 495, 
           align: 'center' 
         });
      
      // Finalize PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate ticket and save to file
 */
export const saveTicketToFile = async (booking, confirmationData, outputPath) => {
  try {
    const pdfBuffer = await generateTicketPDF(booking, confirmationData);
    fs.writeFileSync(outputPath, pdfBuffer);
    return outputPath;
  } catch (error) {
    console.error('Error saving ticket to file:', error);
    throw error;
  }
};

export default {
  generateTicketPDF,
  saveTicketToFile
};
