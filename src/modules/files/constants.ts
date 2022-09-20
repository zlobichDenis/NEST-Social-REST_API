export const errorMessages = {
    publicFileNotFound: (fileId: number) => `File with id=${fileId} was not found`,
    forbiddenDelete: (fileId: number) => `You are not owner of file with id=${fileId}`,
};