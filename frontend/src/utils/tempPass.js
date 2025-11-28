const generateTempPassword = () => {
    const length = 8;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars = lower + upper + digits + special;

    // Ensure at least one of each required type
    let tempPassword = '';
    tempPassword += lower[Math.floor(Math.random() * lower.length)];
    tempPassword += upper[Math.floor(Math.random() * upper.length)];
    tempPassword += digits[Math.floor(Math.random() * digits.length)];
    tempPassword += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        tempPassword += allChars[randomIndex];
    }

    // Shuffle to randomize positions
    tempPassword = tempPassword
        .split('')
        .sort(() => 0.5 - Math.random())
        .join('');

    return tempPassword;
};

export { generateTempPassword };
