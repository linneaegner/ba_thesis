// api/delete-data.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ error: 'Missing required field: participantId' });
    }

    console.log(`Attempting to soft delete data for participant ${participantId}`);

    // Perform a soft delete by setting the 'deletedAt' timestamp
    const updatedParticipant = await prisma.participant.update({
      where: { id: participantId },
      data: {
        deletedAt: new Date(), // Set current timestamp to mark as deleted
        experiment: {}, // Clear experiment data
        questionnaire: {}, // Clear questionnaire data
      },
    });

    // Check if the participant was actually found and updated
    if (!updatedParticipant) {
      // This case might happen if the ID doesn't exist, update handles this gracefully
      // but you might want to log it or return a different status if necessary.
      console.warn(`Participant not found during soft delete request: ${participantId}`);
      return res.status(404).json({ message: 'Participant not found', participantId });
    }


    console.log(`Data successfully marked as deleted for participant ${participantId}`);
    return res.status(200).json({ message: 'Data marked for deletion successfully', participantId });

  } catch (error) {
    console.error('Error processing /api/delete-data:', error);

    // Handle cases where the participant might not exist (update throws error if not found)
    // Prisma's update throws P2025 if record to update not found.
    if (error.code === 'P2025') {
       console.warn(`Participant not found during soft delete request (error catch): ${req.body.participantId}`);
       return res.status(404).json({ message: 'Participant not found', participantId: req.body.participantId });
    }


    return res.status(500).json({ error: 'Failed to process deletion request', details: error.message });
  } finally {
     // Optional disconnect
     // await prisma.$disconnect();
  }
}