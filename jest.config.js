const pathIgnorePattterns = ['<rootDir>/node_modules/', '<rootDir>/examples/', '<rootDir>/img/'];

module.exports = {
    coveragePathIgnorePatterns: pathIgnorePattterns,
    testPathIgnorePatterns: pathIgnorePattterns,
    modulePathIgnorePatterns: pathIgnorePattterns,
};
