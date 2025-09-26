
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

interface PromptDisplayProps {
    prompt: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ prompt }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 w-full text-left animate-fade-in">
            <h2 className="text-2xl font-kalam font-bold text-amber-800 mb-2">Your Magic Prompt ✨</h2>
            <div className="relative p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-inner">
                <p className="text-gray-700 text-lg leading-relaxed">{prompt}</p>
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 rounded-full bg-yellow-200 hover:bg-yellow-300 text-amber-800 transition-all duration-200"
                    aria-label="Copy prompt"
                >
                   <CopyIcon copied={copied} />
                </button>
            </div>
        </div>
    );
};
