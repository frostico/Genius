import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-between px-4">
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="mb-8">
                    <Image src="/logo.png" alt="Genius Logo" width={150} height={150} />
                </div>
                <h1 className="text-5xl font-bold mb-4 text-blue-600">Genius</h1>
                <h2 className="text-2xl mb-8 text-gray-600">Your AI-powered Chatbot Assistant</h2>
                <p className="max-w-md mb-8 text-gray-700">
                    Experience the power of artificial intelligence with Genius.<br /> 
                    Get instant answers, creative ideas, and intelligent conversation at your fingertips.
                </p>
                <div className="space-x-4">
                    <Link href="/sign-in" passHref>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
                            Login
                        </Button>
                    </Link>
                    <Link href="/sign-up" passHref>
                        <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="py-4 text-sm text-gray-500">
                © 2024 Genius AI. All rights reserved.
            </div>
        </div>
    );
};

export default LandingPage;
