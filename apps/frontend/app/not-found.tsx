import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-md p-6 text-center">
            <h1 className="mb-2 text-2xl font-semibold">404</h1>
            <p className="mb-4 text-sm text-zinc-500">This page doesn't exist.</p>
            <Link href="/" className="text-sm underline">
                Back to home
            </Link>
        </div>
    );
}