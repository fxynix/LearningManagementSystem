export interface GiftQuestion {
    title: string;
    question: string;
    type: 'choice' | 'multi' | 'short' | 'numeric' | 'essay';
    options?: { text: string; correct: boolean; weight: number }[];
    correct?: string | null;
}

export const parseGift = (giftText: string): GiftQuestion[] => {
    if (!giftText || typeof giftText !== 'string') return [];
    const lines = giftText.split('\n');
    const result: GiftQuestion[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) { i++; continue; }

        const text = lines.slice(i).join('\n');
        const blocks = extractQuestionBlocks(text);
        if (blocks.length === 0) break;

        for (const block of blocks) {
            const parsed = parseBlock(block);
            if (parsed) result.push(parsed);
        }
        break;
    }

    return result;
};

function extractQuestionBlocks(fullText: string): { questionPart: string; answerPart: string }[] {
    const blocks: { questionPart: string; answerPart: string }[] = [];
    let pos = 0;
    while (pos < fullText.length) {
        const open = fullText.indexOf('{', pos);
        if (open === -1) break;

        let depth = 0;
        let close = -1;
        for (let j = open; j < fullText.length; j++) {
            if (fullText[j] === '{') depth++;
            if (fullText[j] === '}') {
                depth--;
                if (depth === 0) {
                    close = j;
                    break;
                }
            }
        }
        if (close === -1) break;

        const questionPart = fullText.substring(pos, open).trim();
        const answerPart = fullText.substring(open + 1, close).trim();
        blocks.push({ questionPart, answerPart });
        pos = close + 1;
    }
    return blocks;
}

function parseBlock(block: { questionPart: string; answerPart: string }): GiftQuestion | null {
    let qText = block.questionPart;
    let aText = block.answerPart;

    const clozeMatch = qText.match(/\{=([^}]*)\}/);
    if (clozeMatch) {
        const cleanQuestion = qText.replace(/\{=[^}]*\}/, '').trim();
        return {
            title: '',
            question: cleanQuestion,
            type: 'short',
            correct: clozeMatch[1],
            options: undefined
        };
    }

    let title = '';
    if (qText.startsWith('::') && qText.includes('::')) {
        const parts = qText.split('::');
        if (parts.length >= 3) {
            title = parts[1].trim();
            qText = parts.slice(2).join('::').trim();
        }
    }

    const lines = qText.split('\n').filter(l => l.trim() !== '');
    const filteredLines = lines.filter(l => !l.trim().startsWith('#'));
    const question = filteredLines.join(' ').trim();

    const tokens = tokenize(aText);
    if (tokens.length === 0) {
        return {
            title,
            question: question || qText,
            type: 'essay',
            correct: aText,
            options: undefined
        };
    }

    const hasEquals = tokens.some(t => t.type === '=' || t.type === '+');
    const hasTilde = tokens.some(t => t.type === '~');
    const hasHash = tokens.some(t => t.type === '#');

    if (hasHash && !hasEquals && !hasTilde) {
        return {
            title,
            question: question || qText,
            type: 'numeric',
            correct: tokens.find(t => t.type === '#')!.text,
            options: undefined
        };
    }

    if (hasEquals && !hasTilde) {
        if (tokens.length === 1 && tokens[0].type === '=') {
            return {
                title,
                question: question || qText,
                type: 'short',
                correct: tokens[0].text,
                options: undefined
            };
        }
        const options = tokens.map(t => ({
            text: t.text,
            correct: t.type === '=' || t.type === '+',
            weight: (t.type === '=' || t.type === '+') ? 1 : 0
        }));
        return {
            title,
            question: question || qText,
            type: 'choice',
            options,
            correct: null
        };
    }

    if (hasTilde) {
        const hasWeights = tokens.some(t => t.weight !== undefined);
        if (hasWeights) {
            const options = tokens.map(t => {
                const weight = t.weight ?? 0;
                return {
                    text: t.text,
                    correct: weight > 0,
                    weight
                };
            });
            return {
                title,
                question: question || qText,
                type: 'multi',
                options,
                correct: null
            };
        }
        const eqToken = tokens.find(t => t.type === '=' || t.type === '+');
        if (eqToken) {
            const options = tokens.map(t => ({
                text: t.text,
                correct: t.type === '=' || t.type === '+',
                weight: (t.type === '=' || t.type === '+') ? 1 : 0
            }));
            return {
                title,
                question: question || qText,
                type: 'choice',
                options,
                correct: null
            };
        }
        const options = tokens.map(t => ({
            text: t.text,
            correct: false,
            weight: 0
        }));
        return {
            title,
            question: question || qText,
            type: 'multi',
            options,
            correct: null
        };
    }

    return {
        title,
        question: question || qText,
        type: 'essay',
        correct: aText,
        options: undefined
    };
}

function tokenize(text: string): { type: string; weight?: number; text: string }[] {
    const tokens: { type: string; weight?: number; text: string }[] = [];
    const pattern = /([=+~#])(?:%([-+]?\d+(?:\.\d+)?)%\s*)?([^=+~#]*?)(?=\s*[=+~#]|$)/g;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        const type = match[1];
        const weightStr = match[2];
        const textVal = match[3].trim();
        if (textVal || type === '#') {
            tokens.push({
                type,
                weight: weightStr ? parseFloat(weightStr) / 100 : undefined,
                text: textVal
            });
        }
    }
    return tokens;
}