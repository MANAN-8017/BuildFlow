const create = async (estimationData) => {
    try {
        const estimation = await Estimation.create(estimationData);
        return estimation;
    }
    catch (error) {
        throw new Error(`Error creating estimation: ${error.message}`);
    }
}

module.exports = { create };