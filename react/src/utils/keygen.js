let count =1;
export const resetKey = () => {
    count = 1;
}

export const getNextKey = () => {
    return ('element-key-' + (count++))
}