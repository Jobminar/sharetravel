import axios from "axios";
import { AadharValidation } from "../model/AgentValidation.js";

const validateAadhar = async (req, res) => {
  const { aadhaar_number } = req.body;

  try {
    const existingRecord = await AadharValidation.findOne({ aadhaar_number });

    if (existingRecord) {
      if (existingRecord.request_count >= 3) {
        return res
          .status(429)
          .json({ message: "Request limit exceeded for the day" });
      }

      const timeDiff = new Date() - new Date(existingRecord.last_requested);
      if (timeDiff < 24 * 60 * 60 * 1000) {
        existingRecord.request_count += 1;
      } else {
        existingRecord.request_count = 1;
      }
      existingRecord.last_requested = new Date();
      await existingRecord.save();
    } else {
      const newRecord = new AadharValidation({
        aadhaar_number,
        request_count: 1,
        last_requested: new Date(),
      });
      await newRecord.save();
    }

    const response = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-validation/aadhaar-validation",
      {
        id_number: aadhaar_number,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMTk2NDk3NCwianRpIjoiOTFhOWQ1M2MtYWZmOC00MzczLTgxMTItZWJmYzFmMDk1YWFmIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnVzZXJuYW1lXzJlc3ZzZndydWpieG1jNXRndWlqc3IxdXZzZEBzdXJlcGFzcy5pbyIsIm5iZiI6MTcxMTk2NDk3NCwiZXhwIjoxNzE0NTU2OTc0LCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsidXNlciJdfX0.WJdDJTDxUPP2l9F622bxj-Q0vc-6Gp-pNIbToD_RWtA",
        },
      },
    );

    const { data } = response.data;
    await AadharValidation.findOneAndUpdate({ aadhaar_number }, data, {
      new: true,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { validateAadhar };
