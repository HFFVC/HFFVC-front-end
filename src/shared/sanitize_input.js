function sanitizeInputForCorda(input) {
    if (input.createdBy) {
        delete input.createdBy
    }
    if (input.modifiedBy) {
        delete input.modifiedBy
    }
    if (input.updatedBy) {
        delete input.updatedBy
    }
    return input;
}

export default sanitizeInputForCorda;