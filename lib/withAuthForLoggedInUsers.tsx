import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function withAuthForLoggedInUsers<P>(Component: React.ComponentType<P>) {
    return function AuthenticatedComponent(props: P) {
        const router = useRouter();

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const token = Cookies.get('token');
                if (!token) {
                    router.push('/login');
                }
            }
        }, [router]);

        return <Component {...(props as P & JSX.IntrinsicAttributes)} />;
    };
}