import PDFDocument from "pdfkit";
import bwipjs from "bwip-js";
import fs from "fs";
import path from "path";

export const generateTokenPDF = async (bookingData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                student_name,
                reg_no,
                meal_type,
                food_pref,
                booking_date,
                booking_time,
                token_number
            } = bookingData;

            // 🔥 Automatically set serving date = next day
          const bookingDateObj = new Date(booking_date + "T00:00:00");
bookingDateObj.setDate(bookingDateObj.getDate() + 1);
const serving_date = bookingDateObj.toLocaleDateString("en-CA");

            const folderPath = path.join("tokens");
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            const filePath = path.join(folderPath, `token_${token_number}.pdf`);

            const doc = new PDFDocument({ margin: 40 });
            doc.pipe(fs.createWriteStream(filePath));

            // Title
            doc
                .fontSize(22)
                .text("Hostel Meal Token", { align: "center" })
                .moveDown(1.5);

            doc.fontSize(14);

            doc.text(`Student Name       : ${student_name}`);
            doc.text(`Register Number    : ${reg_no}`);
            doc.text(`Meal Type          : ${meal_type}`);
            doc.text(`Food Preference    : ${food_pref}`);
            doc.text(`Booking Date       : ${booking_date}`);
            doc.text(`Booking Time       : ${booking_time}`);

            doc.moveDown(1);

            // ✅ Only Serving Date
            doc.text(`Food Serving Date  : ${serving_date}`);

            doc.moveDown(1);

            doc.text(`Token Number       : ${token_number}`);

            doc.moveDown(2);

            // Barcode
            const barcodeBuffer = await bwipjs.toBuffer({
                bcid: "code128",
                text: token_number,
                scale: 3,
                height: 10,
                includetext: true,
                textxalign: "center",
            });

            doc.image(barcodeBuffer, {
                fit: [300, 100],
                align: "center"
            });

            doc.end();

            resolve(filePath);

        } catch (error) {
            reject(error);
        }
    });
};