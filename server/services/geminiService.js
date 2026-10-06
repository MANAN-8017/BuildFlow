const { GoogleGenAI } = require("@google/genai");

const MODEL = "gemini-3.6-flash";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY
});

const ESTIMATE_SCHEMA = {
    type: "object",
    properties: {
        cement: {
            type: "number",
            description: "Estimated cement required in 50kg bags"
        },
        sand: {
            type: "number",
            description: "Estimated sand required in cubic feet"
        },
        steel: {
            type: "number",
            description: "Estimated reinforcement steel required in kg"
        },
        estimatedCost: {
            type: "number",
            description: "Estimated construction material cost in INR"
        },
        notes: {
            type: "string",
            description: "Short explanation of assumptions and any input warning"
        }
    },
    required: [
        "cement",
        "sand",
        "steel",
        "estimatedCost"
    ]
};

const buildPrompt = ({
    length,
    width,
    height,
    floors,
    buildingType
}) => `
You are a construction estimation assistant for BuildFlow, an Indian construction-material platform.

Your task is to generate a realistic PRELIMINARY MATERIAL ESTIMATE.

BUILDING DETAILS:
- Length: ${length} ft
- Width: ${width} ft
- Height: ${height} ft
- Floors: ${floors}
- Building type: ${buildingType}

CALCULATION RULES:

1. Calculate the footprint:
   footprint = length × width

2. Calculate total built-up area:
   builtUpArea = length × width × floors

3. Do NOT calculate material quantities by multiplying the entire building volume
   (length × width × height) by material coefficients.

4. Height should only be used to identify unusual inputs or provide a warning.
   Do not automatically increase material quantities because of height.

5. For a normal RCC-framed residential building, use these approximate
   preliminary thumb-rule ranges per square foot of total built-up area:

   Cement:
   approximately 0.35 to 0.45 bags per sq.ft.

   Sand:
   approximately 1.2 to 1.6 cubic feet per sq.ft.

   Steel:
   approximately 3.5 to 4.5 kg per sq.ft.

6. Select reasonable values within these ranges based on the building type.
   Do not deliberately choose the highest value unless the building type
   reasonably requires it.

7. Calculate the quantities using:
   cement = built-up area × cement rate
   sand = built-up area × sand rate
   steel = built-up area × steel rate

8. Round cement, sand and steel to whole numbers.

9. Estimate MATERIAL COST only.

Use these approximate reference rates:
- Cement: INR 400 per 50kg bag
- Sand: INR 60 per cubic foot
- Steel: INR 65 per kg

10. Calculate the base material cost from the estimated cement, sand and steel.

11. Add a reasonable allowance of approximately 15% to 25% for other major
    construction materials such as bricks/blocks, aggregate and related
    material requirements.

12. Do NOT include labour cost, contractor profit, land cost, furniture,
    appliances, electrical installation or plumbing labour.

13. Do NOT artificially inflate the estimated cost.

14. The final estimatedCost must be mathematically consistent with the
    estimated material quantities and the rates above.

15. If the dimensions appear unusual, mention the issue in "notes".
    For example, a very large length or an unusually high height for a
    single-floor building should generate a warning asking the user to
    verify the dimensions.

16. The estimate is approximate and should not be presented as an exact
    construction quotation.

IMPORTANT:
Return ONLY valid JSON matching the provided schema.
Do not return markdown.
Do not return code fences.
Do not return any text outside the JSON.

Return:
{
    "cement": number,
    "sand": number,
    "steel": number,
    "estimatedCost": number,
    "notes": "short explanation"
}
`;

const estimateMaterials = async ({
    length,
    width,
    height,
    floors = 1,
    buildingType = "residential"
}) => {
    if (
        length <= 0 ||
        width <= 0 ||
        height <= 0 ||
        floors <= 0
    ) {
        throw new Error(
            "length, width, height and floors must be positive numbers"
        );
    }

    let response;

    try {
        response = await ai.models.generateContent({
            model: MODEL,
            contents: buildPrompt({
                length,
                width,
                height,
                floors,
                buildingType
            }),
            config: {
                responseMimeType: "application/json",
                responseSchema: ESTIMATE_SCHEMA,
                temperature: 0.1
            }
        });
    } catch (error) {
        throw new Error(`Gemini request failed: ${error.message}`);
    }

    let parsed;

    try {
        parsed = JSON.parse(response.text);
    } catch (error) {
        throw new Error(
            "Gemini returned a response that could not be parsed as JSON"
        );
    }

    for (const key of [
        "cement",
        "sand",
        "steel",
        "estimatedCost"
    ]) {
        if (
            typeof parsed[key] !== "number" ||
            Number.isNaN(parsed[key]) ||
            parsed[key] < 0
        ) {
            throw new Error(
                `Gemini returned an invalid value for "${key}"`
            );
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

module.exports = {
    estimateMaterials
};