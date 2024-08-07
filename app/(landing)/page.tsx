import { Button } from "@/components/ui/button";
import Link from 'next/link';

const LandingPage = () => {
    return (
        <div>
            <h1>Landing Page (Unprotected)</h1>
            <div>
                <Link href="/sign-in" passHref>
                    <Button>
                        Login
                    </Button>
                </Link>
                <Link href="/sign-up" passHref>
                    <Button>
                        Register
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
