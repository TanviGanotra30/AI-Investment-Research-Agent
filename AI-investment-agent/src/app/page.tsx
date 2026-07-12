"use client";

import { useState } from "react";

import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import Loading from "../components/Loading";
import ResearchCard from "../components/ResearchCard";
import DecisionCard from "../components/DecisionCard";
import ReasoningCard from "../components/ReasoningCard";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
const handleSearch = async (company: string) => {

    if (!company) return;

    setLoading(true);

    try {

        const response = await fetch("/api/research", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ company }),
        });

        const data = await response.json();

        setResult(data);

        console.log(data);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }
};

  return (

    <main className="min-h-screen bg-gray-100 py-16">

      <div className="max-w-6xl mx-auto">

        <Header />

        <SearchBox onSearch={handleSearch} />

        {loading && <Loading />}

        {result && (
    <div className="mt-10 space-y-6">

        <ResearchCard
            title="Company"
            value={result.company}
        />

        <DecisionCard
            decision={result.decision}
        />

        <ReasoningCard
            reasoning={result.reasoning}
        />

    </div>
)}

      </div>

    </main>

  );
}