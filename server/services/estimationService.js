const Estimation = require("../models/estimation");
const geminiService = require("./geminiService");

const generateEstimate = async ({ length, width, height, floors, buildingType }) => {
    return await geminiService.estimateMaterials({ length, width, height, floors, buildingType });
};

const create = async ({ userId, estimationId, length, width, height, floors, buildingType }) => {
    try {
        const aiEstimate = await geminiService.estimateMaterials({ length, width, height, floors, buildingType });

        const estimation = await Estimation.create({
            userId,
            estimationId,
            length,
            width,
            height,
            cement: aiEstimate.cement,
            sand: aiEstimate.sand,
            steel: aiEstimate.steel,
            estimatedCost: aiEstimate.estimatedCost,
            aiSummary: aiEstimate.notes
        });

        return estimation;
    } catch (error) {
        throw new Error(`Error creating estimation: ${error.message}`);
    }
}

module.exports = { create, generateEstimate };
