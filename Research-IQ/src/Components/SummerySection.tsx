import React, { useContext, useEffect, useRef, useState } from "react";
import { ThemeContextData } from "../Context/ThemeContext";
import { getSummary } from "../API/GetSummary.api";
import LoadingPage from "./LoadingPage";
import Button from "./Button/Button";

interface Props {}

interface SummaryResponse {
    title: string;
    authors: string[];
    keywords: string[];
    objective: string;
    section_summaries: Record<string, string>;
    datasets: string[];
    models: string[];
    metrics: string[];
    key_results: string[];
    key_contributions: string[];
    limitations: string[];
    future_work: string[];
}

const SummerySection: React.FC<Props> = () => {
    const { theme } = useContext(ThemeContextData);

    const [response, setResponse] = useState<SummaryResponse | null>(null);
    const [isGettingSummery, setIsGettingSummery] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
    const [error, setError] = useState("");

    const controllerRef = useRef<AbortController | null>(null);

    const fetchSummary = async () => {
        const paperId = localStorage.getItem("paper_id");

        if (!paperId) return;

        // Cancel previous request if it exists
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        setIsGettingSummery(true);
        setShowRetry(false);
        setError("");

        // Timeout after 2 minutes
        const timeout = setTimeout(() => {
            controller.abort();
        }, 120000);

        try {
            const data = await getSummary(controller.signal);

            clearTimeout(timeout);

            setResponse(data);
        } catch (err: any) {
            clearTimeout(timeout);

            if (err.name === "AbortError") {
                setError(
                    "The request took longer than 2 minutes. Please try again."
                );
            } else {
                console.error(err);
                setError("Failed to fetch summary.");
            }

            setShowRetry(true);
        } finally {
            setIsGettingSummery(false);
        }
    };

    useEffect(() => {
        fetchSummary();

        return () => {
            controllerRef.current?.abort();
        };
    }, []);

    if (isGettingSummery) {
        return (
            <LoadingPage>
                LOADING SUMMARY
            </LoadingPage>
        );
    }

    if (showRetry) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
                <p className="text-center text-red-500 text-sm">{error}</p>

                <Button
                    onClick={fetchSummary}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 font-semibold lg:flex-1 lg:min-h-0 lg:overflow-y-auto font-league">
            {/* Title */}
            {response?.title && (
                <h2 className="tracking-[1px] text-xl mb-2 text-center">
                    {response.title}
                </h2>
            )}

            {/* Authors */}
            {response?.authors && (
                <div className="text-[11px] leading-7 mb-5 flex flex-row justify-center gap-1 flex-wrap">
                    {response.authors.map((author) => (
                        <div
                            key={author}
                            className="px-2 border border-white"
                        >
                            {author}
                        </div>
                    ))}
                </div>
            )}

            {/* Keywords */}
            {response?.keywords && (
                <>
                    <h2 className="tracking-[3px] text-xs mb-5 text-center">
                        KEYWORDS
                    </h2>

                    <div className="space-y-5">
                        {response.keywords.map((keyword) => (
                            <div
                                key={keyword}
                                className={`border-[3px] p-4 text-[11px] ${
                                    theme === "light"
                                        ? "border-black"
                                        : "border-[#4d4d4d]"
                                }`}
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Summary */}
            {response?.section_summaries && (
                <div>
                    <h2 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Summary
                    </h2>

                    <div className="space-y-10 text-[11px] leading-5">
                        {Object.entries(response.section_summaries).map(
                            ([key, value]) => (
                                <div key={key}>
                                    <h3 className="font-bold uppercase text-center border-b">
                                        {key}
                                    </h3>

                                    <p className="text-center tracking-normal">
                                        {value}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Datasets */}
            {response?.datasets.length ? (
                <>
                    <h3 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Datasets
                    </h3>

                    <ul className="text-xs mt-2 list-disc flex flex-row flex-wrap justify-center gap-3">
                        {response.datasets.map((dataset) => (
                            <li key={dataset}>{dataset}</li>
                        ))}
                    </ul>
                </>
            ) : null}

            {/* Models */}
            {response?.models.length ? (
                <>
                    <h2 className="tracking-[1px] text-xl mt-5 mb-3 text-center">
                        MODELS
                    </h2>

                    <div className="text-[11px] leading-7 mb-5 flex flex-row justify-center gap-1 flex-wrap">
                        {response.models.map((model) => (
                            <div
                                key={model}
                                className="px-2 border border-white"
                            >
                                {model}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Metrics */}
            {response?.metrics.length ? (
                <>
                    <h2 className="tracking-[1px] text-xl mt-5 mb-3 text-center">
                        METRICS
                    </h2>

                    <div className="text-[11px] leading-7 mb-5 flex flex-row justify-center gap-1 flex-wrap">
                        {response.metrics.map((metric) => (
                            <div
                                key={metric}
                                className="px-2 border border-white"
                            >
                                {metric}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Key Results */}
            {response?.key_results.length ? (
                <>
                    <h2 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Key Results
                    </h2>

                    <ul className="list-disc text-[11px] space-y-2 pl-5">
                        {response.key_results.map((result) => (
                            <li key={result}>{result}</li>
                        ))}
                    </ul>
                </>
            ) : null}

            {/* Key Contributions */}
            {response?.key_contributions.length ? (
                <>
                    <h2 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Key Contributions
                    </h2>

                    <ul className="list-disc text-[11px] space-y-2 pl-5">
                        {response.key_contributions.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </>
            ) : null}

            {/* Limitations */}
            {response?.limitations.length ? (
                <>
                    <h2 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Limitations
                    </h2>

                    <ul className="list-disc text-[11px] space-y-2 pl-5">
                        {response.limitations.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </>
            ) : null}

            {/* Future Work */}
            {response?.future_work.length ? (
                <>
                    <h2 className="font-archivo tracking-[1px] text-xl mt-10 mb-3 uppercase font-extrabold text-center">
                        Future Work
                    </h2>

                    <ul className="list-disc text-[11px] space-y-2 pl-5">
                        {response.future_work.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </>
            ) : null}
        </div>
    );
};

export default SummerySection;