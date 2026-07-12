// "use client";

// import { useState } from "react";

// interface SearchBoxProps {
//   onSearch: (company: string) => void;
// }

// export default function SearchBox({ onSearch }: SearchBoxProps) {
//   const [company, setCompany] = useState("");

//   return (
//     <div className="flex gap-4 justify-center">
//       <input
//         type="text"
//         placeholder="Enter Company Name"
//         value={company}
//         onChange={(e) => setCompany(e.target.value)}
//         className="border rounded-lg px-4 py-3 w-96"
//       />

//       <button
//         onClick={() => onSearch(company)}
//         className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
//       >
//         Analyze
//       </button>
//     </div>
//   );
// }/


"use client";

import { useState } from "react";

interface Props {
    onSearch: (company: string) => void;
}

export default function SearchBox({ onSearch }: Props) {

    const [company, setCompany] = useState("");

    return (

        <div className="flex justify-center gap-4 mb-12">

            <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Search Company (Tesla, Apple...)"
                className="
                w-[500px]
                rounded-xl
                border
                bg-white
                px-5
                py-4
                text-lg
                shadow-md
                outline-none
                focus:ring-4
                focus:ring-blue-300
                "
            />

            <button
                onClick={() => onSearch(company)}
                className="
                rounded-xl
                bg-blue-600
                px-8
                text-white
                font-semibold
                shadow-lg
                hover:bg-blue-700
                transition
                "
            >
                Analyze
            </button>

        </div>

    );

}