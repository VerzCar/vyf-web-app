// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
(window as never).global = window;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
(window as never).process = {
    env: { DEBUG: undefined }
};
