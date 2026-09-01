const { GoogleGenAI } = require("@google/genai");

const MODEL = "gemini-3.6-flash";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

// Strict JSON schema so Gemini can only respond with numbers we can trust,
// no prose, no markdown fences, no missing fields.
const ESTIMATE_SCHEMA = {
    type: "object",
    properties: {
        cement: {
            type: "number",
            description: "Estimated cement required, in 50kg bags"
        },
        sand: {
            type: "number",
            description: "Estimated sand required, in cubic feet"
        },
        steel: {
            type: "number",
            description: "Estimated steel/reinforcement required, in kg"
        },
        estimatedCost: {
            type: "number",
            description: "Total estimated material cost in INR"
        },
        notes: {
            type: "string",
            description: "One short sentence on assumptions made (rates used, structure type, etc.)"
        }
    },
    required: ["cement", "sand", "steel", "estimatedCost"]
};

const buildPrompt = ({ length, width, height, floors, buildingType }) => `
You are a construction material estimation assistant for a platform called BuildFlow.
Estimate the construction materials required and their approximate cost in Indian
Rupees (INR) for the structure described below, based on standard Indian RCC-framed
construction thumb rules.

Building details:
- Length: ${length} ft
- Width: ${width} ft
- Height: ${height} ft
- Floors: ${floors}
- Building type: ${buildingType}

Guidance:
- Compute built-up area as length x width x floors (sq. ft).
- Use realistic Indian residential/commercial construction thumb rules, roughly:
  ~0.4 bags of cement, ~1.5 cubic ft of sand, and ~4-5 kg of steel per sq. ft of
  built-up area, scaled sensibly for the given height and building type.
- Estimate total material cost using approximate current Indian market rates
  (cement ~INR 400/bag, sand ~INR 60/cft, steel ~INR 65/kg), plus a reasonable
  allowance for other materials such as bricks and aggregate.
- Round cement, sand, and steel to whole numbers and cost to the nearest 100 INR.
- Respond with realistic numbers only - do not include any commentary outside the
  JSON fields.
`;

/**
 * Calls Gemini to estimate material quantities and cost from building
 * dimensions. Returns { cement, sand, steel, estimatedCost, notes }.
 */
const estimateMaterials = async ({ length, width, height, floors = 1, buildingType = "residential" }) => {
    if (length <= 0 || width <= 0 || height <= 0) {
        throw new Error("length, width and height must be positive numbers");
    }

    const client = ai;

    let response;
    try {
        response = await client.models.generateContent({
            model: MODEL,
            contents: buildPrompt({ length, width, height, floors, buildingType }),
            config: {
                responseMimeType: "application/json",
                responseSchema: ESTIMATE_SCHEMA,
                temperature: 0.2 //for randomness, but we want a deterministic response so keep it low
            }
        });
    } catch (error) {
        throw new Error(`Gemini request failed: ${error.message}`);
    }

    let parsed;
    try {
        parsed = JSON.parse(response.text);
    } catch (error) {
        throw new Error("Gemini returned a response that could not be parsed as JSON");
    }

    for (const key of ["cement", "sand", "steel", "estimatedCost"]) {
        if (typeof parsed[key] !== "number" || Number.isNaN(parsed[key]) || parsed[key] < 0) {
            throw new Error(`Gemini returned an invalid value for "${key}"`);
        }
    }

    return {
        cement: Math.round(parsed.cement),
        sand: Math.round(parsed.sand),
        steel: Math.round(parsed.steel),
        estimatedCost: Math.round(parsed.estimatedCost),
        notes: parsed.notes || ""
    };
};

module.exports = { estimateMaterials };
