export default function Loading() {
    return (

        <div className="flex flex-col items-center mt-16">

            <div className="h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

            <p className="mt-6 text-lg text-gray-600">
                AI is researching the company...
            </p>

        </div>

    );
}