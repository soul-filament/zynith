import  'colors'

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: true });
}

function logInternal(action: string, message:string) {
    console.log(`${formatTime().dim} ${'[zynth]'.cyan.bold} ${action} ${message}`);
}

export function logger(prefix: string) {
    return {
        log: (message: string) => logInternal(prefix.green, message),
    }
}
