import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptDisplay } from './components/PromptDisplay';
import { Loader } from './components/Loader';
import { generatePromptFromImage } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
    const [image, setImage] = useState<{ file: File, url: string } | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [style, setStyle] = useState<string>('Ultra HD');

    const styles = ['Ultra HD', 'Realistic', 'Smooth face', 'Cinematic'];

    const handleImageUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setImage({ file, url });
        setPrompt('');
        setError('');
    };

    const handleGeneratePrompt = useCallback(async () => {
        if (!image) return;

        setIsLoading(true);
        setError('');
        setPrompt('');

        try {
            const generatedPrompt = await generatePromptFromImage(image.file, style);
            setPrompt(generatedPrompt);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [image, style]);
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-yellow-200">
            <main className="container mx-auto max-w-2xl w-full flex flex-col items-center text-center">
                <header className="mb-8">
                    <h1 className="text-5xl md:text-6xl font-kalam font-bold text-yellow-500 tracking-tight">Nano Banana</h1>
                    <p className="text-xl text-amber-700 mt-1">Magic Image to Prompt</p>
                </header>

                <div className="w-full bg-white/60 p-6 rounded-3xl shadow-lg border-2 border-dashed border-amber-300">
                    <ImageUploader onImageUpload={handleImageUpload} imageUrl={image?.url ?? null} />

                    {image && (
                        <div className="mt-6 w-full animate-fade-in">
                            <h2 className="text-xl font-kalam font-bold text-amber-800 mb-3">🎨 Choose a Style</h2>
                            <div className="flex flex-wrap justify-center gap-2">
                                {styles.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStyle(s)}
                                        className={`px-4 py-2 text-sm rounded-full font-semibold border-2 transition-all duration-200 ${
                                            style === s
                                                ? 'bg-yellow-400 border-yellow-400 text-amber-900 shadow'
                                                : 'bg-transparent border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {image && (
                        <button
                            onClick={handleGeneratePrompt}
                            disabled={isLoading}
                            className="mt-6 flex items-center justify-center gap-2 w-full max-w-xs mx-auto bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed text-amber-900 font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:shadow-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon />
                                    Generate Magic Prompt
                                </>
                            )}
                        </button>
                    )}

                    {error && (
                        <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {prompt && !isLoading && (
                         <PromptDisplay prompt={prompt} />
                    )}
                </div>

                <footer className="mt-12 text-center text-amber-600/80 text-sm">
                    <p>© 2025 RM</p>
                </footer>
            </main>
        </div>
    );
};

export default App;