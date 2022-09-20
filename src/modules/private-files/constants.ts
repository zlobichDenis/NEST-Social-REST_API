export const errorMessages = {
    fileNotFound: (fileId: number) => `File with id=${fileId} was not found`,
    forbiddenAccess: (fileId: number) => `You are not owner of file with id=${fileId}`
};