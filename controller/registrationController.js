import Registration from '../model/registrationModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const registrationControl = {
    createRegistartion: [
        upload.single('certificate'),
        async (req, res) => {
            try {
               
                if (!req.file) {
                    return res.status(400).json({ message: 'certificate file is required' });
                }

                const { name,email,phone } = req.body;
              if(!name ||!email ||!phone){
                return res.status(400).json({message:"required fileds missing name email phone"})
              }
                const newPdf = new Registration({name: name, pdf: req.file.buffer});

                // Save the PDF document to the database
                await newPdf.save();

                // Respond with success message
                res.status(201).json({ message: 'PDF created successfully' });
            } catch (error) {
                // Handle errors
                console.error("Error creating PDF:", error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    ],
    getRegisterAll: async (req, res) => {
        try {
            // Retrieve all PDFs from the database
            const getData = await Registration.find();

            // Send the PDFs as a response
            res.status(200).json(getData);
        } catch (error) {
            // Handle errors
            console.error("Error fetching PDFs:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getRegisterById: async (req, res) => {
        try {
            // Retrieve PDF by ID from the request parameters
            const registerId = req.params.id;
            const pdf = await Registration.findById(registerId);

            // If PDF is not found
            if (!pdf) {
                return res.status(404).json({ message: 'PDF not found' });
            }

            // Send the PDF file as a response
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdf.pdf); // Assuming pdf.pdf contains the Buffer data of the PDF
        } catch (error) {
            // Handle errors
            console.error("Error fetching PDF:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
export default registrationControl;
