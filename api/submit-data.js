// api/submit-data.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { participantId, formType, data } = req.body;

    // Basic validation
    if (!participantId || !formType || typeof data !== 'object') {
      return res.status(400).json({ error: 'Missing or invalid required fields: participantId, formType, data' });
    }

    // Prepare data based on formType - map frontend `data` to the correct schema field
    let dataToStore = {};
    if (formType === 'questionnaire') {
      dataToStore = { questionnaire: data };
    } else if (formType === 'comment') {
      // Frontend sends comment_text and experimentVersion in 'data'
      dataToStore = { experiment: data };
    } else if (formType === 'feedback') {
      dataToStore = { feedback: data };
    } else {
      return res.status(400).json({ error: `Invalid formType: ${formType}` });
    }

    console.log(`Upserting data for participant ${participantId}, formType ${formType}`);

    // Use upsert: Create participant if not exist, update if exists
    const participant = await prisma.participant.upsert({
      where: { id: participantId }, // Find participant by their unique ID
      create: {
        id: participantId, // Set the ID on creation
        ...dataToStore      // Add the specific form data
      },
      update: {
        ...dataToStore      // Update with the specific form data (overwrites previous data for this formType)
      },
    });

    console.log(`Data successfully stored for participant ${participantId}`);
    return res.status(200).json({ message: 'Data saved successfully', participantId: participant.id });

  } catch (error) {
    console.error('Error processing /api/submit-data:', error);

    // Check for specific Prisma errors if needed (e.g., validation errors)
    // if (error instanceof Prisma.PrismaClientValidationError) { ... }

    return res.status(500).json({ error: 'Failed to process data', details: error.message });
  } finally {
    // Optional: Disconnect Prisma client if not using serverless functions
    // await prisma.$disconnect(); // Generally not needed/recommended with Vercel serverless
  }
}